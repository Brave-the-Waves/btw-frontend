import React, { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '@/config'
import { useAuth } from '@/contexts/AuthContext'


const TABS = [
	{ key: 'registrations', label: 'Registrations' },
	{ key: 'donations', label: 'Donations' },
	{ key: 'receipts', label: 'Tax Receipts' }
]

const REGISTRATION_STATUSES = ['all', 'completed', 'pending', 'failed']
const DONATION_STATUSES = ['all', 'completed', 'pending']
const RECEIPT_STATUSES = ['all', 'issued', 'pending']

const currencyFormatter = new Intl.NumberFormat('en-CA', {
	style: 'currency',
	currency: 'CAD',
	maximumFractionDigits: 2
})

function normalizeCollection(payload, keys = []) {
	if (Array.isArray(payload)) return payload

	for (const key of keys) {
		if (Array.isArray(payload?.[key])) return payload[key]
	}

	if (Array.isArray(payload?.data)) return payload.data
	return []
}

function getPersonName(entity) {
	if (!entity) return 'Unknown'
	if (typeof entity === 'string') return entity
	return entity.name || entity.fullName || entity.email || 'Unknown'
}

function getPersonEmail(entity) {
	if (!entity) return 'N/A'
	if (typeof entity === 'string') return 'N/A'
	return entity.email || 'N/A'
}

function parseAmount(value) {
	const numeric = Number(value)
	return Number.isFinite(numeric) ? numeric : 0
}

function formatDate(value) {
	if (!value) return 'N/A'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return 'N/A'

	return date.toLocaleDateString('en-CA', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}

function toDateInputValue(value) {
	if (!value) return ''
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return ''

	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

function dateWithinRange(dateString, fromDate, toDate) {
	if (!fromDate && !toDate) return true
	if (!dateString) return false

	const value = new Date(dateString)
	if (Number.isNaN(value.getTime())) return false

	if (fromDate) {
		const from = new Date(fromDate)
		from.setHours(0, 0, 0, 0)
		if (value < from) return false
	}

	if (toDate) {
		const to = new Date(toDate)
		to.setHours(23, 59, 59, 999)
		if (value > to) return false
	}

	return true
}

function normalizeRegistrationStatus(item) {
	const raw = String(item?.status || '').toLowerCase()
	if (raw === 'completed' || raw === 'paid' || raw === 'succeeded' || raw === 'success') return 'completed'
	if (raw === 'pending' || raw === 'processing') return 'pending'
	if (raw === 'failed' || raw === 'canceled' || raw === 'cancelled' || raw === 'error') return 'failed'

	if (item?.hasPaid === true) return 'completed'
	if (item?.hasPaid === false) return 'pending'

	return 'pending'
}

function normalizeDonationStatus(item) {
	const raw = String(item?.status || '').toLowerCase()
	if (raw === 'completed' || raw === 'paid' || raw === 'succeeded' || raw === 'success') return 'completed'
	return 'pending'
}

function normalizeReceiptStatus(item) {
	const raw = String(item?.status || '').toLowerCase()
	return raw === 'issued' ? 'issued' : 'pending'
}

function normalizeRegistrations(payload) {
	const list = normalizeCollection(payload, ['registrations', 'payments', 'items'])
	return list.map((item, index) => {
		const user = item?.user || item?.member || item?.participant || null
		return {
			id: item?._id || item?.id || String(index),
			name: item?.name || getPersonName(user),
			email: item?.email || getPersonEmail(user),
			amountPaid: parseAmount(item?.amountPaid ?? item?.amount ?? item?.paymentAmount),
			transactionId: item?.transactionId || item?.paymentIntentId || item?.checkoutSessionId || 'N/A',
			registrationDate: item?.registrationDate || item?.paidAt || item?.createdAt || null,
			status: normalizeRegistrationStatus(item)
		}
	})
}

function normalizeDonations(payload) {
	const list = normalizeCollection(payload, ['donations', 'items'])
	return list.map((item, index) => {
		const donor = item?.donor || item?.donorUser || item?.user || null
		const paddler = item?.paddler || item?.targetUser || item?.recipient || null
		return {
			id: item?._id || item?.id || String(index),
			donorName: item?.donorName || getPersonName(donor),
			amount: parseAmount(item?.amount ?? item?.donationAmount),
			donationDate: item?.donationDate || item?.createdAt || item?.paidAt || null,
			paddler: item?.paddlerName || getPersonName(paddler),
			message: item?.message || item?.note || 'N/A',
			status: normalizeDonationStatus(item)
		}
	})
}

function normalizeReceipts(payload) {
	const list = normalizeCollection(payload, ['taxReceipts', 'receipts', 'items'])
	return list.map((item, index) => {
		const donor = item?.donor || item?.donorUser || item?.user || null
		return {
			id: item?._id || item?.id || String(index),
			receiptNumber: item?.receiptNumber || item?.number || 'N/A',
			donor: item?.donorName || getPersonName(donor),
			amount: parseAmount(item?.amount),
			issuedDate: item?.issuedDate || item?.createdAt || null,
			status: normalizeReceiptStatus(item),
			donorPhone: item?.donorPhone || 'N/A',
			donorAddress: item?.donorAddress || 'N/A'
		}
	})
}

function StatusBadge({ value }) {
	const normalized = String(value || '').toLowerCase()

	const className =
		normalized === 'completed' || normalized === 'issued'
			? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
			: normalized === 'failed'
			? 'bg-rose-100 text-rose-700 border border-rose-200'
			: 'bg-amber-100 text-amber-700 border border-amber-200'

	return (
		<span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${className}`}>
			{value}
		</span>
	)
}

export default function AdminFinance() {
	const { getAccessTokenSilently } = useAuth()

	const [activeTab, setActiveTab] = useState('registrations')
	const [fromDate, setFromDate] = useState('')
	const [toDate, setToDate] = useState('')

	const [registrationStatusFilter, setRegistrationStatusFilter] = useState('all')
	const [donationStatusFilter, setDonationStatusFilter] = useState('all')
	const [receiptStatusFilter, setReceiptStatusFilter] = useState('all')

	const [nameSearch, setNameSearch] = useState('')

	const [registrations, setRegistrations] = useState([])
	const [donations, setDonations] = useState([])
	const [receipts, setReceipts] = useState([])
	const [expandedReceiptId, setExpandedReceiptId] = useState(null)

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const [registrationsLoaded, setRegistrationsLoaded] = useState(false)
	const [donationsLoaded, setDonationsLoaded] = useState(false)
	const [receiptsLoaded, setReceiptsLoaded] = useState(false)

	const [showCashModal, setShowCashModal] = useState(false)
	const [cashAmount, setCashAmount] = useState('')
	const [cashDonorName, setCashDonorName] = useState('')
	const [cashDonationId, setCashDonationId] = useState('')
	const [cashMessage, setCashMessage] = useState('')
	const [cashSubmitting, setCashSubmitting] = useState(false)
	const [cashError, setCashError] = useState('')
	const [successMsg, setSuccessMsg] = useState('')

	const requestWithToken = async (path, options = {}) => {
		const token = await getAccessTokenSilently()
		const res = await fetch(`${API_BASE_URL}${path}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
				...options.headers
			}
		})

		if (!res.ok) {
			const message = await res.text()
			throw new Error(message || 'Failed to fetch finance data')
		}

		return await res.json()
	}

	const fetchRegistrations = async (force = false) => {
		if (registrationsLoaded && !force) return
		setLoading(true)
		setError('')
		try {
			const payload = await requestWithToken('/api/admin/finance/registrations')
			setRegistrations(normalizeRegistrations(payload))
			setRegistrationsLoaded(true)
		} catch (err) {
			console.error('AdminFinance registrations error:', err)
			setError(err?.message || 'Failed to load registrations')
			setRegistrations([])
		} finally {
			setLoading(false)
		}
	}

	const fetchDonations = async (force = false) => {
		if (donationsLoaded && !force) return
		setLoading(true)
		setError('')
		try {
			const payload = await requestWithToken('/api/admin/finance/donations')
			setDonations(normalizeDonations(payload))
			setDonationsLoaded(true)
		} catch (err) {
			console.error('AdminFinance donations error:', err)
			setError(err?.message || 'Failed to load donations')
			setDonations([])
		} finally {
			setLoading(false)
		}
	}

	const fetchReceipts = async (force = false) => {
		if (receiptsLoaded && !force) return

		setLoading(true)
		setError('')
		try {
			const payload = await requestWithToken('/api/admin/finance/tax-receipts')
			setReceipts(normalizeReceipts(payload))
			setReceiptsLoaded(true)
		} catch (err) {
			console.error('AdminFinance receipts error:', err)
			setError(err?.message || 'Failed to load tax receipts')
			setReceipts([])
		} finally {
			setLoading(false)
		}
	}

	const handleCashSubmit = async (e) => {
		e.preventDefault()
		setCashError('')
		setCashSubmitting(true)
		try {
			const body = {
				amount: Number(cashAmount),
				donorName: cashDonorName,
				donationId: cashDonationId,
				message: cashMessage
			}

			await requestWithToken('/api/admin/finance/donations/cash', {
				method: 'POST',
				body: JSON.stringify(body)
			})

			// Refresh donations list and close modal
			setShowCashModal(false)
			setCashAmount('')
			setCashDonorName('')
			setCashDonationId('')
			setCashMessage('')
			fetchDonations(true)
			setSuccessMsg('Cash donation recorded successfully!')
			setTimeout(() => setSuccessMsg(''), 5000)
		} catch (err) {
			console.error('Submit cash donation error:', err)
			setCashError(err?.message || 'Failed to submit cash donation')
		} finally {
			setCashSubmitting(false)
		}
	}

	useEffect(() => {
		setNameSearch('')
		if (activeTab === 'registrations') fetchRegistrations()
		if (activeTab === 'donations') fetchDonations()
		if (activeTab === 'receipts') fetchReceipts()
	}, [activeTab])

	const filteredRegistrations = useMemo(() => {
		const q = nameSearch.trim().toLowerCase()
		return registrations.filter((row) => {
			const dateOk = dateWithinRange(row.registrationDate, fromDate, toDate)
			const statusOk = registrationStatusFilter === 'all' || row.status === registrationStatusFilter
			const nameOk = !q || row.name.toLowerCase().includes(q)
			return dateOk && statusOk && nameOk
		})
	}, [registrations, fromDate, toDate, registrationStatusFilter, nameSearch])

	const filteredDonations = useMemo(() => {
		const q = nameSearch.trim().toLowerCase()
		return donations.filter((row) => {
			const dateOk = dateWithinRange(row.donationDate, fromDate, toDate)
			const statusOk = donationStatusFilter === 'all' || row.status === donationStatusFilter
			const nameOk = !q || row.paddler.toLowerCase().includes(q)
			return dateOk && statusOk && nameOk
		})
	}, [donations, fromDate, toDate, donationStatusFilter, nameSearch])

	const filteredReceipts = useMemo(() => {
		const q = nameSearch.trim().toLowerCase()
		return receipts.filter((row) => {
			const dateOk = dateWithinRange(row.issuedDate, fromDate, toDate)
			const statusOk = receiptStatusFilter === 'all' || row.status === receiptStatusFilter
			const nameOk = !q || row.donor.toLowerCase().includes(q)
			return dateOk && statusOk && nameOk
		})
	}, [receipts, fromDate, toDate, receiptStatusFilter, nameSearch])

	const registrationTotals = useMemo(() => {
		const totalAmount = filteredRegistrations.reduce((sum, row) => sum + row.amountPaid, 0)
		return {
			totalAmount,
			count: filteredRegistrations.length
		}
	}, [filteredRegistrations])

	const donationTotals = useMemo(() => {
		const totalAmount = filteredDonations.reduce((sum, row) => sum + row.amount, 0)
		return {
			totalAmount,
			count: filteredDonations.length
		}
	}, [filteredDonations])

	const receiptTotals = useMemo(() => {
		return {
			count: filteredReceipts.length
		}
	}, [filteredReceipts])

	const clearDateFilters = () => {
		setFromDate('')
		setToDate('')
		setNameSearch('')
	}

	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-2xl font-bold text-slate-900">Finance</h2>
					<p className="text-sm text-slate-500">Registrations, donations, and tax receipt tracking.</p>
				</div>
			</div>

			<div className="rounded-2xl border border-slate-200 bg-white p-2">
				<div className="flex flex-wrap gap-2">
					{TABS.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => setActiveTab(tab.key)}
							className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
								activeTab === tab.key
									? 'bg-[#fc87a7] text-white'
									: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div className="rounded-2xl border border-slate-200 bg-white p-4">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
					<div>
    					<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        					{activeTab === 'registrations' ? 'Name' : activeTab === 'donations' ? 'Paddler name' : 'Donor name'}
    					</label>
    					<input
        					type="text"
        					value={nameSearch}
        					onChange={(e) => setNameSearch(e.target.value)}
        					placeholder={
            					activeTab === 'registrations' ? 'Search by name'
            					: activeTab === 'donations' ? 'Search by paddler'
            					: 'Search by donor'
        					}
        					className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
    					/>
					</div>

					<div>
						<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">From</label>
						<input
							type="date"
							value={fromDate}
							onChange={(event) => setFromDate(event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
						/>
					</div>

					<div>
						<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">To</label>
						<input
							type="date"
							value={toDate}
							onChange={(event) => setToDate(event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
						/>
					</div>

					{activeTab === 'registrations' ? (
						<div>
							<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
							<select
								value={registrationStatusFilter}
								onChange={(event) => setRegistrationStatusFilter(event.target.value)}
								className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
							>
								{REGISTRATION_STATUSES.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					) : null}

					{activeTab === 'donations' ? (
						<div>
							<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
							<select
								value={donationStatusFilter}
								onChange={(event) => setDonationStatusFilter(event.target.value)}
								className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
							>
								{DONATION_STATUSES.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					) : null}

					{activeTab === 'receipts' ? (
						<div>
							<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
							<select
								value={receiptStatusFilter}
								onChange={(event) => setReceiptStatusFilter(event.target.value)}
								className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
							>
								{RECEIPT_STATUSES.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					) : null}

					<div className="flex items-end">
						<button
							type="button"
							onClick={clearDateFilters}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
						>
							Clear date filters
						</button>
					</div>
				</div>

				{(fromDate || toDate) && (
					<p className="mt-3 text-xs text-slate-500">
						Date filter: {fromDate ? formatDate(fromDate) : 'Any'} to {toDate ? formatDate(toDate) : 'Any'}
					</p>
				)}
			</div>

			{error ? (
				<div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
			) : null}

			{successMsg ? (
				<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMsg}</div>
			) : null}

			{activeTab === 'registrations' ? (
				<>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="rounded-2xl border border-slate-200 bg-white p-4">
							<p className="text-xs uppercase tracking-wide text-slate-500">Total registration revenue</p>
							<p className="mt-2 text-2xl font-bold text-slate-900">{currencyFormatter.format(registrationTotals.totalAmount)}</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-white p-4">
							<p className="text-xs uppercase tracking-wide text-slate-500">Registration count</p>
							<p className="mt-2 text-2xl font-bold text-slate-900">{registrationTotals.count.toLocaleString()}</p>
						</div>
					</div>

					<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
						<table className="min-w-full text-sm">
							<thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-3">Name</th>
									<th className="px-4 py-3">Email</th>
									<th className="px-4 py-3">Amount Paid</th>
									<th className="px-4 py-3">Transaction ID</th>
									<th className="px-4 py-3">Registration Date</th>
									<th className="px-4 py-3">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{loading ? (
									<tr>
										<td colSpan={6} className="px-4 py-6 text-center text-slate-500">Loading registrations...</td>
									</tr>
								) : filteredRegistrations.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-4 py-6 text-center text-slate-500">No registrations found.</td>
									</tr>
								) : (
									filteredRegistrations.map((row) => (
										<tr key={row.id} className="text-slate-700">
											<td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
											<td className="px-4 py-3">{row.email}</td>
											<td className="px-4 py-3">{currencyFormatter.format(row.amountPaid)}</td>
											<td className="px-4 py-3">{row.transactionId}</td>
											<td className="px-4 py-3">{formatDate(row.registrationDate)}</td>
											<td className="px-4 py-3"><StatusBadge value={row.status} /></td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</>
			) : null}

			{activeTab === 'donations' ? (
				<>
					<div className="flex items-center justify-between mb-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 flex-grow">
							<div className="rounded-2xl border border-slate-200 bg-white p-4">
								<p className="text-xs uppercase tracking-wide text-slate-500">Total donation amount</p>
								<p className="mt-2 text-2xl font-bold text-slate-900">{currencyFormatter.format(donationTotals.totalAmount)}</p>
							</div>
							<div className="rounded-2xl border border-slate-200 bg-white p-4">
								<p className="text-xs uppercase tracking-wide text-slate-500">Donation count</p>
								<p className="mt-2 text-2xl font-bold text-slate-900">{donationTotals.count.toLocaleString()}</p>
							</div>
						</div>
						<div className="ml-4">
							<button
								onClick={() => setShowCashModal(true)}
								className="rounded-xl bg-[#fc87a7] px-4 py-2 font-semibold text-white hover:bg-[#e67595] transition-colors"
							>
								+ Cash Donation
							</button>
						</div>
					</div>

					<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
						<table className="min-w-full text-sm">
							<thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-3">Donor Name</th>
									<th className="px-4 py-3">Amount</th>
									<th className="px-4 py-3">Donation Date</th>
									<th className="px-4 py-3">Paddler</th>
									<th className="px-4 py-3">Message</th>
									<th className="px-4 py-3">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{loading ? (
									<tr>
										<td colSpan={6} className="px-4 py-6 text-center text-slate-500">Loading donations...</td>
									</tr>
								) : filteredDonations.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-4 py-6 text-center text-slate-500">No donations found.</td>
									</tr>
								) : (
									filteredDonations.map((row) => (
										<tr key={row.id} className="text-slate-700">
											<td className="px-4 py-3 font-medium text-slate-900">{row.donorName}</td>
											<td className="px-4 py-3">{currencyFormatter.format(row.amount)}</td>
											<td className="px-4 py-3">{formatDate(row.donationDate)}</td>
											<td className="px-4 py-3">{row.paddler}</td>
											<td className="px-4 py-3 max-w-xs truncate" title={row.message}>{row.message}</td>
											<td className="px-4 py-3"><StatusBadge value={row.status} /></td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</>
			) : null}

			{activeTab === 'receipts' ? (
				<>
					<div className="rounded-2xl border border-slate-200 bg-white p-4">
						<p className="text-xs uppercase tracking-wide text-slate-500">Tax receipt count</p>
						<p className="mt-2 text-2xl font-bold text-slate-900">{receiptTotals.count.toLocaleString()}</p>
					</div>
			
					<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
						<table className="min-w-full text-sm">
							<thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="w-8 px-4 py-3"></th>
									<th className="px-4 py-3">Receipt Number</th>
									<th className="px-4 py-3">Donor</th>
									<th className="px-4 py-3">Amount</th>
									<th className="px-4 py-3">Issued Date</th>
									<th className="px-4 py-3">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{loading ? (
									<tr>
										<td colSpan={6} className="px-4 py-6 text-center text-slate-500">Loading tax receipts...</td>
									</tr>
								) : filteredReceipts.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-4 py-6 text-center text-slate-500">No tax receipts found.</td>
									</tr>
								) : (
									filteredReceipts.map((row) => (
										<React.Fragment key={row.id}>
											<tr 
												onClick={() => setExpandedReceiptId(expandedReceiptId === row.id ? null : row.id)}
												className="cursor-pointer hover:bg-slate-50 text-slate-700"
											>
												<td className="px-4 py-3 text-center">
													<span className="text-slate-400">
														{expandedReceiptId === row.id ? '▼' : '▶'}
													</span>
												</td>
												<td className="px-4 py-3 font-medium text-slate-900">{row.receiptNumber}</td>
												<td className="px-4 py-3">{row.donor}</td>
												<td className="px-4 py-3">{currencyFormatter.format(row.amount)}</td>
												<td className="px-4 py-3">{formatDate(row.issuedDate)}</td>
												<td className="px-4 py-3"><StatusBadge value={row.status} /></td>
											</tr>
											{expandedReceiptId === row.id && (
												<tr className="bg-slate-50">
													<td colSpan={6} className="px-4 py-4">
														<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
															<div>
																<p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Phone</p>
																<p className="mt-1 text-sm text-slate-900">{row.donorPhone}</p>
															</div>
															<div className="md:col-span-2">
																<p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Address</p>
																<p className="mt-1 text-sm text-slate-900">{row.donorAddress}</p>
															</div>
														</div>
													</td>
												</tr>
											)}
										</React.Fragment>
									))
								)}
							</tbody>
						</table>
					</div>
				</>
			) : null}

			{showCashModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
						<h3 className="text-lg font-bold text-slate-900">Add Cash Donation</h3>
						<p className="mt-1 text-sm text-slate-500">Record an offline cash donation. This instantly updates the paddler's totals.</p>
						
						{cashError && (
							<div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
								{cashError}
							</div>
						)}

						<form onSubmit={handleCashSubmit} className="mt-4 space-y-4">
							<div>
								<label className="mb-1 block text-sm font-semibold text-slate-700">Amount (CAD) <span className="text-rose-500">*</span></label>
								<input
									type="number"
									required
									min="1"
									step="0.01"
									value={cashAmount}
									onChange={(e) => setCashAmount(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
									placeholder="50.00"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-semibold text-slate-700">Donor Name</label>
								<input
									type="text"
									value={cashDonorName}
									onChange={(e) => setCashDonorName(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
									placeholder="John Doe"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-semibold text-slate-700">Paddler Donation ID</label>
								<input
									type="text"
									value={cashDonationId}
									onChange={(e) => setCashDonationId(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
									placeholder="e.g. AbCdEf"
								/>
								<p className="mt-1 text-xs text-slate-500">Find this ID on the public donation page if attributing to a specific paddler.</p>
							</div>
							<div>
								<label className="mb-1 block text-sm font-semibold text-slate-700">Message / Notes</label>
								<textarea
									value={cashMessage}
									onChange={(e) => setCashMessage(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
									placeholder="Cash dropped off at the desk"
									rows="2"
								/>
							</div>

							<div className="mt-6 flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setShowCashModal(false)}
									className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
									disabled={cashSubmitting}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="rounded-lg bg-[#fc87a7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e67595] disabled:opacity-50"
									disabled={cashSubmitting}
								>
									{cashSubmitting ? 'Recording...' : 'Record Cash Donation'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</section>
	)
}
