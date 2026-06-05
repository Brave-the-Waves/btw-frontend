import React, { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '@/config'
import { useAuth } from '@/contexts/AuthContext'

const REGISTRATION_FILTERS = [
	{ value: 'all', label: 'All statuses' },
	{ value: 'registered', label: 'Registered' },
	{ value: 'non-registered', label: 'Non-registered' }
]

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

function formatRegistrationData(registration) {
    if (!registration) return null
    return {
        hasPaid: registration.hasPaid ? 'Yes' : 'No',
        amountPaid: registration.amountPaid ? `$${registration.amountPaid.toFixed(2)}` : '$0.00',
        currency: registration.currency || 'CAD',
        transactionId: registration.transactionId || 'N/A',
        bundleEmails: registration.bundleEmails?.length > 0 ? registration.bundleEmails.join(', ') : 'None',
        paidBy: registration.paidBy || 'Self',
        createdAt: formatDate(registration.createdAt)
    }
}

function formatWaiverData(waiver) {
    if (!waiver) return null
    return {
        completed: waiver.completed ? 'Completed' : 'Incomplete',
        signedAt: formatDate(waiver.signedAt),
        firstName: waiver.firstName || 'N/A',
        lastName: waiver.lastName || 'N/A',
        email: waiver.email || 'N/A',
        phone: waiver.phone || 'N/A',
        dateOfBirth: formatDate(waiver.dateOfBirth),
        paddlingSide: waiver.paddlingSide || 'N/A',
        isExperienced: waiver.isExperienced ? 'Yes' : 'No',
        yearsOfExperience: waiver.yearsOfExperience || 'N/A',
        medicalConditions: waiver.medicalConditions || 'None',
        isMinor: waiver.isMinor ? 'Yes' : 'No',
        emergencyContactName: waiver.emergencyContactName || 'N/A',
        emergencyContactPhone: waiver.emergencyContactPhone || 'N/A',
        parentGuardianName: waiver.isMinor ? (waiver.parentGuardianName || 'N/A') : 'N/A',
        parentGuardianPhone: waiver.isMinor ? (waiver.parentGuardianPhone || 'N/A') : 'N/A'
    }
}

function normalizeMembersResponse(payload) {
	if (Array.isArray(payload)) return payload
	if (Array.isArray(payload?.members)) return payload.members
	if (Array.isArray(payload?.data)) return payload.data
	return []
}

function memberId(member) {
	return member?._id || member?.id || ''
}

function registrationStatus(member) {
	return member?.isRegistered ? 'registered' : 'non-registered'
}

function accountIsDisabled(member) {
	return member?.accountStatus === 'disabled'
}

function getTeamName(member) {
	if (!member?.team) return 'No team'
	if (typeof member.team === 'string') return member.team
	return member.team?.name || member.team?.teamName || 'No team'
}

function ConfirmModal({ isOpen, title, body, confirmText, cancelText = 'Cancel', onConfirm, onCancel, busy }) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
			<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
				<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
				<p className="mt-2 text-sm text-slate-600">{body}</p>
				<div className="mt-6 flex justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						disabled={busy}
						className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{cancelText}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={busy}
						className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{busy ? 'Processing...' : confirmText}
					</button>
				</div>
			</div>
		</div>
	)
}

function MemberDetailsModal({ isOpen, member, onClose }) {
	if (!isOpen || !member) return null

	const waiverText = member?.hasSignedWaiver ? 'Signed' : 'Not signed'
	const regText = member?.isRegistered ? 'Registered' : 'Non-registered'

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
			<div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h3 className="text-lg font-semibold text-slate-900">Member details</h3>
						<p className="text-sm text-slate-500">Registration and waiver information</p>
					</div>
					<button
						type="button"
						className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
						onClick={onClose}
					>
						Close
					</button>
				</div>

				<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
						<p className="text-xs uppercase tracking-wide text-slate-500">Identity</p>
						<p className="mt-2 text-sm text-slate-900"><span className="font-semibold">Name:</span> {member?.name || 'N/A'}</p>
						<p className="mt-1 text-sm text-slate-900"><span className="font-semibold">Email:</span> {member?.email || 'N/A'}</p>
						<p className="mt-1 text-sm text-slate-900"><span className="font-semibold">Team:</span> {getTeamName(member)}</p>
					</div>

					<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
						<p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
						<p className="mt-2 text-sm text-slate-900"><span className="font-semibold">Registration:</span> {regText}</p>
						<p className="mt-1 text-sm text-slate-900"><span className="font-semibold">Waiver:</span> {waiverText}</p>
						<p className="mt-1 text-sm text-slate-900"><span className="font-semibold">Joined:</span> {formatDate(member?.createdAt)}</p>
						<p className="mt-1 text-sm text-slate-900"><span className="font-semibold">Account:</span> {accountIsDisabled(member) ? 'Disabled' : 'Active'}</p>
					</div>
				</div>

				<div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
					<p className="text-xs uppercase tracking-wide text-slate-500">Bio</p>
					<p className="mt-2 text-sm text-slate-900 whitespace-pre-wrap">{member?.bio || 'No bio added.'}</p>
				</div>

				{/* Registration Data Section */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Registration</p>
                    {formatRegistrationData(member?.registration) ? (
                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-slate-500">Payment Status</p>
                                <p className="text-sm font-medium text-slate-900">{formatRegistrationData(member?.registration).hasPaid}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Amount Paid</p>
                                <p className="text-sm font-medium text-slate-900">{formatRegistrationData(member?.registration).amountPaid}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Transaction ID</p>
                                <p className="text-xs font-mono text-slate-600">{formatRegistrationData(member?.registration).transactionId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Date</p>
                                <p className="text-sm text-slate-900">{formatRegistrationData(member?.registration).createdAt}</p>
                            </div>
                            {formatRegistrationData(member?.registration).bundleEmails !== 'None' && (
                                <div className="col-span-full">
                                    <p className="text-xs text-slate-500">Bundle Emails</p>
                                    <p className="text-xs text-slate-600">{formatRegistrationData(member?.registration).bundleEmails}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="mt-2 text-sm text-slate-600">No registration data available.</p>
                    )}
                </div>

                {/* Waiver Data Section */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Waiver Details</p>
                    {formatWaiverData(member?.waiver) ? (
                        <div className="mt-2 space-y-3">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-slate-500">Status</p>
                                    <p className="text-sm font-medium text-slate-900">{formatWaiverData(member?.waiver).completed}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Signed Date</p>
                                    <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).signedAt}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Name</p>
                                    <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).firstName} {formatWaiverData(member?.waiver).lastName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Phone</p>
                                    <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Date of Birth</p>
                                    <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).dateOfBirth}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Paddling Side</p>
                                    <p className="text-sm text-slate-900 capitalize">{formatWaiverData(member?.waiver).paddlingSide}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Experience</p>
                                    <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).isExperienced ? `${formatWaiverData(member?.waiver).yearsOfExperience} years` : 'No'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Minor</p>
                                    <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).isMinor}</p>
                                </div>
                            </div>
                            
                            {formatWaiverData(member?.waiver).medicalConditions !== 'None' && (
                                <div className="border-t border-slate-200 pt-2">
                                    <p className="text-xs text-slate-500">Medical Conditions</p>
                                    <p className="mt-1 text-sm text-slate-900">{formatWaiverData(member?.waiver).medicalConditions}</p>
                                </div>
                            )}

                            {formatWaiverData(member?.waiver).isMinor === 'Yes' && (
                                <div className="border-t border-slate-200 pt-2">
                                    <p className="text-xs font-semibold text-slate-700">Parent/Guardian Info</p>
                                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs text-slate-500">Name</p>
                                            <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).parentGuardianName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Phone</p>
                                            <p className="text-sm text-slate-900">{formatWaiverData(member?.waiver).parentGuardianPhone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-slate-200 pt-2">
                                <p className="text-xs text-slate-500">Emergency Contact</p>
                                <div className="mt-1 text-sm text-slate-900">
                                    <p>{formatWaiverData(member?.waiver).emergencyContactName} - {formatWaiverData(member?.waiver).emergencyContactPhone}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-2 text-sm text-slate-600">No waiver data available.</p>
                    )}
                </div>
			</div>
		</div>
	)
}

function EditBioModal({ isOpen, member, value, onChange, onClose, onSave, busy }) {
	if (!isOpen || !member) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
			<div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
				<h3 className="text-lg font-semibold text-slate-900">Modify member bio</h3>
				<p className="mt-1 text-sm text-slate-500">Updating bio for {member?.name || member?.email}</p>

				<textarea
					className="mt-4 min-h-32 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-slate-500"
					value={value}
					maxLength={300}
					onChange={(event) => onChange(event.target.value)}
					placeholder="Write member bio..."
				/>
				<p className="mt-1 text-xs text-slate-500">{value.length}/300</p>

				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						disabled={busy}
						className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onSave}
						disabled={busy}
						className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{busy ? 'Saving...' : 'Save bio'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default function AdminMembers() {
	const { getAccessTokenSilently } = useAuth()
	const [members, setMembers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [busyActionId, setBusyActionId] = useState('')
	const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' })

	const [confirmState, setConfirmState] = useState({
		open: false,
		type: '',
		member: null
	})

	const [detailsOpen, setDetailsOpen] = useState(false)
	const [detailsMember, setDetailsMember] = useState(null)
	const [bioModalOpen, setBioModalOpen] = useState(false)
	const [bioMember, setBioMember] = useState(null)
	const [bioValue, setBioValue] = useState('')

	const currency = useMemo(
		() =>
			new Intl.NumberFormat('en-CA', {
				style: 'currency',
				currency: 'CAD',
				maximumFractionDigits: 2
			}),
		[]
	)

	const fetchMembers = async () => {
		setLoading(true)
		setError('')
		try {
			const token = await getAccessTokenSilently()
			const params = new URLSearchParams()
			if (search.trim()) params.set('search', search.trim())
			if (statusFilter !== 'all') params.set('status', statusFilter)

			const query = params.toString()
			const res = await fetch(`${API_BASE_URL}/api/admin/members${query ? `?${query}` : ''}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})

			if (!res.ok) {
				const message = await res.text()
				throw new Error(message || 'Failed to fetch members')
			}

			const payload = await res.json()
			setMembers(normalizeMembersResponse(payload))
		} catch (err) {
			console.error('AdminMembers fetch error:', err)
			setError(err?.message || 'Failed to load members')
			setMembers([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchMembers()
	}, [])

	const filteredMembers = useMemo(() => {
		const needle = search.trim().toLowerCase()
		return members.filter((member) => {
			const memberStatus = registrationStatus(member)
			const statusOk = statusFilter === 'all' || memberStatus === statusFilter
			const searchOk =
				!needle ||
				(member?.name || '').toLowerCase().includes(needle)
			return statusOk && searchOk
		})
	}, [members, search, statusFilter])

	const handleSort = (field) => {
		setSortConfig(prevConfig => ({
			field,
			direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
		}))
	}

	const sortedMembers = useMemo(() => {
		const sorted = [...filteredMembers].sort((a, b) => {
			let aVal, bVal
			let isNumeric = false

			switch (sortConfig.field) {
				case 'name':
					aVal = (a?.name || '').toLowerCase()
					bVal = (b?.name || '').toLowerCase()
					break
				case 'email':
					aVal = (a?.email || '').toLowerCase()
					bVal = (b?.email || '').toLowerCase()
					break
				case 'team':
					aVal = getTeamName(a).toLowerCase()
					bVal = getTeamName(b).toLowerCase()
					break
				case 'amountRaised':
					aVal = Number(a?.amountRaised || 0)
					bVal = Number(b?.amountRaised || 0)
					isNumeric = true
					break
				case 'status':
					aVal = registrationStatus(a)
					bVal = registrationStatus(b)
					break
				case 'waiver':
					aVal = a?.hasSignedWaiver ? 'signed' : 'not-signed'
					bVal = b?.hasSignedWaiver ? 'signed' : 'not-signed'
					break
				default:
					return 0
			}

			if (isNumeric) {
				return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
			}

			if (sortConfig.field === 'status') {
				if (sortConfig.direction === 'asc') {
					if (aVal === 'registered' && bVal !== 'registered') return -1
					if (aVal !== 'registered' && bVal === 'registered') return 1
					return 0
				} else {
					if (aVal === 'registered' && bVal !== 'registered') return 1
					if (aVal !== 'registered' && bVal === 'registered') return -1
					return 0
				}
			}

			if (sortConfig.field === 'waiver') {
				if (sortConfig.direction === 'asc') {
					if (aVal === 'signed' && bVal !== 'signed') return -1
					if (aVal !== 'signed' && bVal === 'signed') return 1
					return 0
				} else {
					if (aVal === 'signed' && bVal !== 'signed') return 1
					if (aVal !== 'signed' && bVal === 'signed') return -1
					return 0
				}
			}

			if (sortConfig.direction === 'asc') {
				return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
			} else {
				return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
			}
		})

		return sorted
	}, [filteredMembers, sortConfig])

	const openConfirm = (type, member) => {
		setConfirmState({ open: true, type, member })
	}

	const closeConfirm = () => {
		if (busyActionId) return
		setConfirmState({ open: false, type: '', member: null })
	}

	const requestWithToken = async (url, method = 'GET', body) => {
		const token = await getAccessTokenSilently()
		const res = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: body ? JSON.stringify(body) : undefined
		})

		if (!res.ok) {
			const message = await res.text()
			throw new Error(message || 'Request failed')
		}

		if (res.status === 204) return null

		try {
			return await res.json()
		} catch {
			return null
		}
	}

	const handleDeactivate = async (member) => {
		const id = memberId(member)
		if (!id) return

		setBusyActionId(id)
		setError('')
		try {
			await requestWithToken(`${API_BASE_URL}/api/admin/members/${id}/deactivate`, 'PATCH')
			await fetchMembers()
			closeConfirm()
		} catch (err) {
			console.error('Deactivate error:', err)
			setError(err?.message || 'Failed to deactivate member')
		} finally {
			setBusyActionId('')
		}
	}

	const handleReactivate = async (member) => {
		const id = memberId(member)
		if (!id) return
		setBusyActionId(id)
		setError('')
		try {
			await requestWithToken(`${API_BASE_URL}/api/admin/members/${id}/reactivate`, 'PATCH')
			await fetchMembers()
			closeConfirm()
		} catch (err) {
			console.error('Reactivate error:', err)
			setError(err?.message || 'Failed to reactivate member')
		} finally {
			setBusyActionId('')
		}
	}

	const handleDelete = async (member) => {
		const id = memberId(member)
		if (!id) return
		setBusyActionId(id)
		setError('')
		try {
			await requestWithToken(`${API_BASE_URL}/api/admin/members/${id}`, 'DELETE')
			await fetchMembers()
			closeConfirm()
			if (detailsMember && memberId(detailsMember) === id) {
				setDetailsOpen(false)
				setDetailsMember(null)
			}
		} catch (err) {
			console.error('Delete error:', err)
			setError(err?.message || 'Failed to delete member')
		} finally {
			setBusyActionId('')
		}
	}

	const openDetails = async (member) => {
		const id = memberId(member)
		if (!id) return
		setBusyActionId(id)
		setError('')
		try {
			const detail = await requestWithToken(`${API_BASE_URL}/api/admin/members/${id}`, 'GET')
			setDetailsMember(detail?.member || detail || member)
			setDetailsOpen(true)
		} catch (err) {
			console.error('View details error:', err)
			// If detail endpoint is not ready yet, fall back to row data.
			setDetailsMember(member)
			setDetailsOpen(true)
		} finally {
			setBusyActionId('')
		}
	}

	const openBioModal = (member) => {
		setBioMember(member)
		setBioValue(member?.bio || '')
		setBioModalOpen(true)
	}

	const saveBio = async () => {
		const member = bioMember
		const id = memberId(member)
		if (!id) return
		setBusyActionId(id)
		setError('')
		try {
			const trimmedBio = bioValue.trim()
			try {
				await requestWithToken(`${API_BASE_URL}/api/admin/members/${id}/bio`, 'PATCH', { bio: trimmedBio })
			} catch {
				await requestWithToken(`${API_BASE_URL}/api/admin/members/${id}`, 'PATCH', { bio: trimmedBio })
			}

			await fetchMembers()
			setBioModalOpen(false)
			setBioMember(null)
			setBioValue('')
		} catch (err) {
			console.error('Save bio error:', err)
			setError(err?.message || 'Failed to update member bio')
		} finally {
			setBusyActionId('')
		}
	}

	const confirmBusy = !!busyActionId && confirmState.member && busyActionId === memberId(confirmState.member)

	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
				<p className="text-slate-600">Loading members...</p>
			</div>
		)
	}

	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="text-2xl font-bold text-slate-900">Members</h2>
					<p className="text-sm text-slate-500">Manage membership, profile data, and account actions.</p>
				</div>
			</div>

			{error ? (
				<div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
					{error}
				</div>
			) : null}

			<div className="rounded-2xl border border-slate-200 bg-white p-4">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					<div className="md:col-span-2">
						<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search by name</label>
						<input
							type="text"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Type a name"
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
						/>
					</div>

					<div>
						<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Registration status</label>
						<select
							value={statusFilter}
							onChange={(event) => setStatusFilter(event.target.value)}
							className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
						>
							{REGISTRATION_FILTERS.map((item) => (
								<option key={item.value} value={item.value}>{item.label}</option>
							))}
						</select>
					</div>
				</div>

				<div className="mt-4 overflow-x-auto">
					<table className="min-w-full border-separate border-spacing-0">
						<thead>
							<tr>
								<th 
									onClick={() => handleSort('name')}
									className="cursor-pointer border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-50 select-none"
								>
									Name {sortConfig.field === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
								</th>
								<th 
									onClick={() => handleSort('email')}
									className="cursor-pointer border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-50 select-none"
								>
									Email {sortConfig.field === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
								</th>
								<th 
									onClick={() => handleSort('team')}
									className="cursor-pointer border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-50 select-none"
								>
									Team {sortConfig.field === 'team' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
								</th>
								<th 
									onClick={() => handleSort('amountRaised')}
									className="cursor-pointer border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-50 select-none"
								>
									Amount raised {sortConfig.field === 'amountRaised' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
								</th>
								<th 
									onClick={() => handleSort('status')}
									className="cursor-pointer border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-50 select-none"
								>
									Status {sortConfig.field === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
								</th>
								<th 
									onClick={() => handleSort('waiver')}
									className="cursor-pointer border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-50 select-none"
								>
									Waiver {sortConfig.field === 'waiver' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
								</th>
								<th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
							</tr>
						</thead>
						<tbody>
							{sortedMembers.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">No members match your filters.</td>
								</tr>
							) : (
								sortedMembers.map((member) => {
									const id = memberId(member)
									const registered = member?.isRegistered
									const hasWaiver = member?.hasSignedWaiver
									const disabled = accountIsDisabled(member)
									const memberBusy = busyActionId === id

									return (
										<tr key={id || `${member?.email}-${member?.name}`} className="hover:bg-slate-50">
											<td className="border-b border-slate-100 px-3 py-3 text-sm text-slate-900">{member?.name || 'N/A'}</td>
											<td className="border-b border-slate-100 px-3 py-3 text-sm text-slate-700">{member?.email || 'N/A'}</td>
											<td className="border-b border-slate-100 px-3 py-3 text-sm text-slate-700">{getTeamName(member)}</td>
											<td className="border-b border-slate-100 px-3 py-3 text-sm text-slate-700">{currency.format(Number(member?.amountRaised || 0))}</td>
											<td className="border-b border-slate-100 px-3 py-3 text-sm">
												<span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${registered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
													{registered ? 'Registered' : 'Non-registered'}
												</span>
											</td>
											<td className="border-b border-slate-100 px-3 py-3 text-sm">
												<span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${hasWaiver ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-700'}`}>
													{hasWaiver ? 'Signed' : 'Not signed'}
												</span>
											</td>
											<td className="border-b border-slate-100 px-3 py-3 text-sm">
												<div className="flex flex-wrap gap-2">
													<button
														type="button"
														onClick={() => openDetails(member)}
														disabled={memberBusy}
														className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
													>
														View
													</button>
													<button
														type="button"
														onClick={() => openBioModal(member)}
														disabled={memberBusy}
														className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
													>
														Modify bio
													</button>
													<button
														type="button"
														onClick={() => openConfirm(disabled ? 'reactivate' : 'deactivate', member)}
														disabled={memberBusy}
														className={`rounded-md px-2.5 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${disabled ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
													>
														{disabled ? 'Reactivate' : 'Deactivate'}
													</button>
													<button
														type="button"
														onClick={() => openConfirm('delete', member)}
														disabled={memberBusy}
														className="rounded-md bg-rose-100 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			<MemberDetailsModal
				isOpen={detailsOpen}
				member={detailsMember}
				onClose={() => {
					if (busyActionId) return
					setDetailsOpen(false)
					setDetailsMember(null)
				}}
			/>

			<EditBioModal
				isOpen={bioModalOpen}
				member={bioMember}
				value={bioValue}
				onChange={setBioValue}
				onSave={saveBio}
				onClose={() => {
					if (busyActionId) return
					setBioModalOpen(false)
					setBioMember(null)
					setBioValue('')
				}}
				busy={!!busyActionId && bioMember && busyActionId === memberId(bioMember)}
			/>

			<ConfirmModal
				isOpen={confirmState.open}
				title={
					confirmState.type === 'delete'
						? 'Delete member'
						: confirmState.type === 'reactivate'
							? 'Reactivate member'
							: 'Deactivate member'
				}
				body={
					confirmState.type === 'delete'
						? `Delete ${confirmState.member?.name || 'this member'}? This action cannot be undone.`
						: confirmState.type === 'reactivate'
							? `Reactivate ${confirmState.member?.name || 'this member'}? They will regain account access.`
							: `Deactivate ${confirmState.member?.name || 'this member'}? They will lose access until reactivated.`
				}
				confirmText={
					confirmState.type === 'delete'
						? 'Delete user'
						: confirmState.type === 'reactivate'
							? 'Reactivate account'
							: 'Deactivate account'
				}
				onCancel={closeConfirm}
				onConfirm={() => {
					if (!confirmState.member) return
					if (confirmState.type === 'delete') {
						handleDelete(confirmState.member)
						return
					}
					if (confirmState.type === 'reactivate') {
						handleReactivate(confirmState.member)
						return
					}
					handleDeactivate(confirmState.member)
				}}
				busy={confirmBusy}
			/>
		</section>
	)
}
