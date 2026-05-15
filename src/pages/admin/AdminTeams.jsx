import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRightLeft, Plus, Search, Trash2, UserCog, Users, X } from 'lucide-react'
import { API_BASE_URL } from '@/config'
import { useAuth } from '@/contexts/AuthContext'

const ACTION_MODES = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'manage', label: 'Manage Team' },
]

const initialTeamForm = {
	name: '',
	description: '',
	captainId: ''
}

function normalizeCollection(payload, keys = []) {
	if (Array.isArray(payload)) return payload
	for (const key of keys) {
		if (Array.isArray(payload?.[key])) return payload[key]
	}
	if (Array.isArray(payload?.data)) return payload.data
	return []
}

function getUserId(user) {
	return user?._id || user?.id || ''
}

function getTeamId(team) {
	return team?._id || team?.id || ''
}

function getCaptain(team) {
	if (!team) return null
	if (team.captain && typeof team.captain === 'object') {
		return {
			id: getUserId(team.captain),
			name: team.captain.name || team.captain.email || 'Unknown captain',
			email: team.captain.email || ''
		}
	}

	const captainId = team?.captain || team?.captainId || ''
	return {
		id: captainId,
		name: team?.captainName || 'Unassigned captain',
		email: team?.captainEmail || ''
	}
}

function getTeamMembers(team) {
	if (Array.isArray(team?.members)) {
		return team.members.map((member) => ({
			id: getUserId(member) || member,
			name: member?.name || member?.email || 'Member',
			email: member?.email || ''
		}))
	}

	return []
}

function normalizeTeam(team) {
	const members = getTeamMembers(team)
	const fallbackCount =
		Number(team?.memberCount) || Number(team?.membersCount) || Number(team?.member_count) || members.length || 0

	return {
		id: getTeamId(team),
		name: team?.name || 'Untitled Team',
		division: team?.division || 'Community',
		description: team?.description || 'No description added yet.',
		totalDonations:
			Number(team?.totalDonations) ||
			Number(team?.donationTotal) ||
			Number(team?.totalRaised) ||
			Number(team?.total_raised) ||
			0,
		memberCount: fallbackCount,
		captain: getCaptain(team),
		members,
		raw: team
	}
}

function getDivisionBadgeClass(division) {
    const value = (division || '').toLowerCase()
    if (value === 'corporate') return 'bg-blue-100 text-blue-700'
    if (value === 'sports') return 'bg-purple-100 text-purple-700'
    return 'bg-emerald-100 text-emerald-700'
}

function ModalFrame({ title, subtitle, onClose, children, maxWidth = 'max-w-3xl' }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
			<div className={`w-full ${maxWidth} max-h-[90vh] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl`}>
				<div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
					<div>
						<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
						{subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				<div className="p-5">{children}</div>
			</div>
		</div>
	)
}

function ConfirmModal({ isOpen, title, body, confirmText, busy, onCancel, onConfirm }) {
	if (!isOpen) return null

	return (
		<ModalFrame title={title} subtitle="Please confirm this action." onClose={onCancel} maxWidth="max-w-md">
			<p className="text-sm text-slate-700">{body}</p>
			<div className="mt-6 flex justify-end gap-2">
				<button
					type="button"
					onClick={onCancel}
					disabled={busy}
					className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
				>
					Cancel
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
		</ModalFrame>
	)
}

function TeamFormModal({
	open,
	mode,
	team,
	form,
	setForm,
	allRegisteredMembers,
	busy,
	onClose,
	onSubmit
}) {
	if (!open) return null

	const isEdit = mode === 'edit'
	const title = isEdit ? 'Edit team' : 'Create new team'
	const subtitle = isEdit ? 'Update team name, description, and captain.' : 'Create a new team and optionally select a captain.'

	return (
		<ModalFrame title={title} subtitle={subtitle} onClose={onClose}>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="md:col-span-2">
					<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Team name</label>
					<input
						type="text"
						value={form.name}
						onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
						placeholder="Enter team name"
						maxLength={80}
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
					/>
				</div>

				<div className="md:col-span-2">
					<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
					<textarea
						value={form.description}
						onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
						maxLength={400}
						rows={4}
						placeholder="Describe your team"
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
					/>
					<p className="mt-1 text-xs text-slate-500">{form.description.length}/400</p>
				</div>

				<div className="md:col-span-2">
					<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Team captain</label>
					<select
						value={form.captainId}
						onChange={(event) => setForm((prev) => ({ ...prev, captainId: event.target.value }))}
						className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
					>
						<option value="">No captain assigned</option>
						{allRegisteredMembers.map((member) => (
							<option key={member.id} value={member.id}>
								{member.name} {member.email ? `(${member.email})` : ''}
							</option>
						))}
					</select>
				</div>
			</div>

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
					onClick={onSubmit}
					disabled={busy || !form.name.trim()}
					className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{busy ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save changes' : 'Create team'}
				</button>
			</div>

			{isEdit && team ? (
				<p className="mt-3 text-xs text-slate-500">
					Last updated team info for <span className="font-semibold text-slate-700">{team.name}</span>.
				</p>
			) : null}
		</ModalFrame>
	)
}

function TeamMembersModal({
	open,
	team,
	allTeams,
	allRegisteredMembers,
	busy,
	moveWithDonations,
	setMoveWithDonations,
	targetTeamId,
	setTargetTeamId,
	selectedAddMemberId,
	setSelectedAddMemberId,
	onClose,
	onAddMember,
	onRemoveMember,
	onMoveMember
}) {
	if (!open || !team) return null

	const memberIds = new Set(team.members.map((member) => member.id))
	const addCandidates = allRegisteredMembers.filter((member) => !memberIds.has(member.id))
	const moveTargets = allTeams.filter((item) => item.id !== team.id)

	return (
		<ModalFrame
			title={`Manage Members - ${team.name}`}
			subtitle="Add and remove paddlers, or move members between teams."
			onClose={onClose}
			maxWidth="max-w-5xl"
		>
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
				<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
					<h4 className="text-sm font-semibold text-slate-900">Current team members</h4>

					<div className="mt-3 space-y-2">
						{team.members.length === 0 ? (
							<p className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">
								No members in this team.
							</p>
						) : (
							team.members.map((member) => {
								const isLeader = team.captain?.id && team.captain.id === member.id
								return (
									<div key={member.id} className="rounded-lg border border-slate-200 bg-white p-3">
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div>
												<p className="text-sm font-semibold text-slate-900">{member.name}</p>
												<p className="text-xs text-slate-500">{member.email || 'No email available'}</p>
												{isLeader ? (
													<span className="mt-1 inline-flex rounded-full bg-[#fc87a7]/15 px-2 py-0.5 text-xs font-semibold text-[#c14a75]">
														Team leader
													</span>
												) : null}
											</div>

											<div className="flex flex-wrap gap-2">
												<button
													type="button"
													onClick={() => onRemoveMember(member)}
													disabled={busy}
													className="rounded-md bg-rose-100 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
												>
													Remove
												</button>
												<button
													type="button"
													onClick={() => onMoveMember(member)}
													disabled={busy || !targetTeamId}
													className="rounded-md bg-sky-100 px-2.5 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
												>
													Move
												</button>
											</div>
										</div>
									</div>
								)
							})
						)}
					</div>
				</div>

				<div className="space-y-4">
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
						<h4 className="text-sm font-semibold text-slate-900">Add registered member</h4>
						<div className="mt-3 flex flex-col gap-2">
							<select
								value={selectedAddMemberId}
								onChange={(event) => setSelectedAddMemberId(event.target.value)}
								className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
							>
								<option value="">Select a registered member</option>
								{addCandidates.map((member) => (
									<option key={member.id} value={member.id}>
										{member.name} {member.email ? `(${member.email})` : ''}
									</option>
								))}
							</select>
							<button
								type="button"
								onClick={onAddMember}
								disabled={busy || !selectedAddMemberId}
								className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{busy ? 'Saving...' : 'Add to team'}
							</button>
						</div>
					</div>

					<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
						<h4 className="text-sm font-semibold text-slate-900">Move member to another team</h4>
						<p className="mt-1 text-xs text-slate-500">Choose a destination team, then click Move on a member row.</p>
						<div className="mt-3 space-y-2">
							<select
								value={targetTeamId}
								onChange={(event) => setTargetTeamId(event.target.value)}
								className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
							>
								<option value="">Select destination team</option>
								{moveTargets.map((item) => (
									<option key={item.id} value={item.id}>
										{item.name}
									</option>
								))}
							</select>

							<label className="inline-flex items-center gap-2 text-sm text-slate-700">
								<input
									type="checkbox"
									checked={moveWithDonations}
									onChange={(event) => setMoveWithDonations(event.target.checked)}
									className="h-4 w-4 rounded border-slate-300 text-[#fc87a7] focus:ring-[#fc87a7]"
								/>
								Move donations associated with the member
							</label>
						</div>
					</div>
				</div>
			</div>
		</ModalFrame>
	)
}

export default function AdminTeams() {
	const { getAccessTokenSilently } = useAuth()

	const [teams, setTeams] = useState([])
	const [registeredMembers, setRegisteredMembers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [search, setSearch] = useState('')
	const [mode, setMode] = useState('overview')
	const [busyId, setBusyId] = useState('')

	const [formOpen, setFormOpen] = useState(false)
	const [formMode, setFormMode] = useState('create')
	const [formTeam, setFormTeam] = useState(null)
	const [teamForm, setTeamForm] = useState(initialTeamForm)

	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
	const [deleteTeam, setDeleteTeam] = useState(null)

	const [confirmRemoveMemberOpen, setConfirmRemoveMemberOpen] = useState(false)
	const [memberToRemove, setMemberToRemove] = useState(null)

	const [membersModalOpen, setMembersModalOpen] = useState(false)
	const [membersTeam, setMembersTeam] = useState(null)
	const [selectedAddMemberId, setSelectedAddMemberId] = useState('')
	const [targetTeamId, setTargetTeamId] = useState('')
	const [moveWithDonations, setMoveWithDonations] = useState(true)

	const unassignedCaptain = {
		id: '',
		name: 'Unassigned captain',
		email: ''
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

	const fetchRegisteredMembers = async () => {
		try {
			const payload = await requestWithToken(`${API_BASE_URL}/api/admin/members?status=registered`)
			const members = normalizeCollection(payload, ['members'])
			return members.map((member) => ({
				id: getUserId(member),
				name: member?.name || member?.email || 'Member',
				email: member?.email || ''
			})).filter((member) => member.id)
		} catch {
			const fallbackPayload = await requestWithToken(`${API_BASE_URL}/api/admin/members`)
			const members = normalizeCollection(fallbackPayload, ['members'])
			return members
				.filter((member) => member?.isRegistered)
				.map((member) => ({
					id: getUserId(member),
					name: member?.name || member?.email || 'Member',
					email: member?.email || ''
				}))
				.filter((member) => member.id)
		}
	}

	const fetchTeams = async () => {
		const payload = await requestWithToken(`${API_BASE_URL}/api/admin/teams`)
		const nextTeams = normalizeCollection(payload, ['teams']).map(normalizeTeam).filter((team) => team.id)
		setTeams(nextTeams)
		return nextTeams
	}

	const bootstrap = async () => {
		setLoading(true)
		setError('')
		try {
			const [nextTeams, nextMembers] = await Promise.all([fetchTeams(), fetchRegisteredMembers()])
			setTeams(nextTeams)
			setRegisteredMembers(nextMembers)
		} catch (err) {
			console.error('AdminTeams bootstrap error:', err)
			setError(err?.message || 'Failed to load teams data.')
			setTeams([])
			setRegisteredMembers([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		bootstrap()
	}, [])

	const filteredTeams = useMemo(() => {
		const needle = search.trim().toLowerCase()
		return teams.filter((team) => {
			if (!needle) return true
			return (
				team.name.toLowerCase().includes(needle)
			)
		})
	}, [teams, search])

	const openCreateForm = () => {
		setFormMode('create')
		setFormTeam(null)
		setTeamForm(initialTeamForm)
		setFormOpen(true)
	}

	const openEditForm = (team) => {
		setFormMode('edit')
		setFormTeam(team)
		setTeamForm({
			name: team.name,
			description: team.description === 'No description added yet.' ? '' : team.description,
			captainId: team.captain?.id || ''
		})
		setFormOpen(true)
	}

	const submitTeamForm = async () => {
		setError('')
		const payload = {
			name: teamForm.name.trim(),
			description: teamForm.description.trim(),
			captainId: teamForm.captainId || null
		}

		if (!payload.name) return

		const pendingId = formTeam?.id || 'create'
		setBusyId(pendingId)

		try {
			if (formMode === 'create') {
				await requestWithToken(`${API_BASE_URL}/api/admin/teams`, 'POST', payload)
			} else if (formTeam?.id) {
				await requestWithToken(`${API_BASE_URL}/api/admin/teams/${formTeam.id}`, 'PATCH', payload)
				if (payload.captainId !== (formTeam.captain?.id || '')) {
					await requestWithToken(`${API_BASE_URL}/api/admin/teams/${formTeam.id}/captain`, 'PATCH', {
						captainId: payload.captainId || null
					})
				}
			}

			await bootstrap()
			setFormOpen(false)
			setFormTeam(null)
			setTeamForm(initialTeamForm)
		} catch (err) {
			console.error('Team form submit error:', err)
			setError(err?.message || 'Failed to save team.')
		} finally {
			setBusyId('')
		}
	}

	const openDeleteConfirm = (team) => {
		setDeleteTeam(team)
		setConfirmDeleteOpen(true)
	}

	const deleteSelectedTeam = async () => {
		if (!deleteTeam?.id) return
		setBusyId(deleteTeam.id)
		setError('')
		try {
			await requestWithToken(`${API_BASE_URL}/api/admin/teams/${deleteTeam.id}`, 'DELETE')
			await bootstrap()
			setConfirmDeleteOpen(false)
			setDeleteTeam(null)
		} catch (err) {
			console.error('Delete team error:', err)
			setError(err?.message || 'Failed to delete team.')
		} finally {
			setBusyId('')
		}
	}

	const openMembersModal = (team) => {
		setMembersTeam(team)
		setSelectedAddMemberId('')
		setTargetTeamId('')
		setMoveWithDonations(true)
		setMembersModalOpen(true)
	}

	const refreshMembersTeam = (teamId, nextTeams) => {
		const source = nextTeams || teams
		const refreshed = source.find((item) => item.id === teamId)
		if (refreshed) setMembersTeam(refreshed)
	}

	const addMemberToTeam = async () => {
		if (!membersTeam?.id || !selectedAddMemberId) return

		setBusyId(membersTeam.id)
		setError('')
		try {
			await requestWithToken(`${API_BASE_URL}/api/admin/teams/${membersTeam.id}/members`, 'PATCH', {
				action: 'add',
				memberIds: [selectedAddMemberId],
				moveDonations: false
			})

			const nextTeams = await fetchTeams()
			refreshMembersTeam(membersTeam.id, nextTeams)
			setSelectedAddMemberId('')
		} catch (err) {
			console.error('Add member error:', err)
			setError(err?.message || 'Failed to add member to team.')
		} finally {
			setBusyId('')
		}
	}

	const openRemoveMemberConfirm = (member) => {
    	setMemberToRemove(member)
    	setConfirmRemoveMemberOpen(true)
	}

	const confirmRemoveMember = async () => {
    	if (!memberToRemove) return
    	await removeMemberFromTeam(memberToRemove)
    	setConfirmRemoveMemberOpen(false)
    	setMemberToRemove(null)
	}

	const removeMemberFromTeam = async (member) => {
		if (!membersTeam?.id || !member?.id) return

		setBusyId(membersTeam.id)
		setError('')
		try {
			await requestWithToken(`${API_BASE_URL}/api/admin/teams/${membersTeam.id}/members`, 'PATCH', {
				action: 'remove',
				memberIds: [member.id],
				moveDonations: false
			})

			const nextTeams = await fetchTeams()
			refreshMembersTeam(membersTeam.id, nextTeams)
		} catch (err) {
			console.error('Remove member error:', err)
			setError(err?.message || 'Failed to remove member from team.')
		} finally {
			setBusyId('')
		}
	}

	const moveMemberBetweenTeams = async (member) => {
		if (!membersTeam?.id || !member?.id || !targetTeamId) return

		setBusyId(membersTeam.id)
		setError('')
		try {
			await requestWithToken(`${API_BASE_URL}/api/admin/teams/${membersTeam.id}/members`, 'PATCH', {
				action: 'move',
				memberId: member.id,
				targetTeamId,
				moveDonations: moveWithDonations
			})

			const nextTeams = await fetchTeams()
			refreshMembersTeam(membersTeam.id, nextTeams)
		} catch (err) {
			console.error('Move member error:', err)
			setError(err?.message || 'Failed to move member.')
		} finally {
			setBusyId('')
		}
	}

	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
				<p className="text-slate-600">Loading teams...</p>
			</div>
		)
	}

	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="text-2xl font-bold text-slate-900">Teams</h2>
					<p className="text-sm text-slate-500">
						Manage teams, captains, and registered member assignments.
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={openCreateForm}
						className="inline-flex items-center gap-2 rounded-xl bg-[#fc87a7] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#f56f95] transition-colors"
					>
						<Plus className="h-4 w-4" />
						Create Team
					</button>
				</div>
			</div>

			{error ? (
				<div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
					{error}
				</div>
			) : null}

			<div className="rounded-2xl border border-slate-200 bg-white p-4">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-5">
					<div className="md:col-span-2">
						<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search teams</label>
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search by team name"
								className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-slate-500"
							/>
						</div>
					</div>

					<div className="md:col-span-3">
						<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Action mode</label>
						<div className="flex flex-wrap gap-2">
							{ACTION_MODES.map((item) => (
								<button
									key={item.value}
									type="button"
									onClick={() => setMode(item.value)}
									className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
										mode === item.value
											? 'bg-[#fc87a7]/15 text-[#c14a75]'
											: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
									}`}
								>
									{item.label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{filteredTeams.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
					<p className="text-sm text-slate-600">No teams match your search.</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{filteredTeams.map((team) => {
						const isBusy = busyId === team.id
						return (
							<article
								key={team.id}
								className="relative rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm"
							>
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#fc87a7]/5 to-transparent" />
								<div className="relative z-10">
									<div className="flex items-start justify-between gap-3">
										<div>
											<h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
											<p className="mt-1 text-sm text-slate-600 line-clamp-3">{team.description}</p>
										</div>
										<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDivisionBadgeClass(team.division)}`}>
											{team.division}
										</span>
									</div>

									<div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
										<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Team captain</p>
										<p className="mt-1 text-sm font-semibold text-slate-900">{team.captain?.name || 'Unassigned captain'}</p>
										<p className="text-xs text-slate-500">{team.captain?.email || 'No email available'}</p>
									</div>

									<div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
										<Users className="h-3.5 w-3.5" />
										<span>{team.memberCount} members</span>
									</div>
									<div className="mt-1 text-xs text-slate-500">Total donations: {team.totalDonations.toLocaleString()}</div>

									<div className="mt-4 flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => openMembersModal(team)}
											disabled={isBusy}
											className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
										>
											<Users className="h-3.5 w-3.5" />
											View members
										</button>

										{(mode === 'manage' || mode === 'overview') && (
											<button
												type="button"
												onClick={() => openEditForm(team)}
												disabled={isBusy}
												className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
											>
												<UserCog className="h-3.5 w-3.5" />
												Edit team
											</button>
										)}

										{mode === 'manage' && (
											<button
												type="button"
												onClick={() => openDeleteConfirm(team)}
												disabled={isBusy}
												className="inline-flex items-center gap-1.5 rounded-md bg-rose-100 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
											>
												<Trash2 className="h-3.5 w-3.5" />
												Delete team
											</button>
										)}
									</div>
								</div>
							</article>
						)
					})}
				</div>
			)}

			<TeamFormModal
				open={formOpen}
				mode={formMode}
				team={formTeam}
				form={teamForm}
				setForm={setTeamForm}
				allRegisteredMembers={registeredMembers}
				busy={busyId === (formTeam?.id || 'create')}
				onClose={() => {
					if (busyId) return
					setFormOpen(false)
					setFormTeam(null)
					setTeamForm(initialTeamForm)
				}}
				onSubmit={submitTeamForm}
			/>

			<ConfirmModal
				isOpen={confirmDeleteOpen}
				title="Delete team"
				body={`Delete ${deleteTeam?.name || 'this team'}? Members will no longer have a team attributed.`}
				confirmText="Delete team"
				busy={busyId === deleteTeam?.id}
				onCancel={() => {
					if (busyId) return
					setConfirmDeleteOpen(false)
					setDeleteTeam(null)
				}}
				onConfirm={deleteSelectedTeam}
			/>

			<div className="relative z-[60]">
				<ConfirmModal
					isOpen={confirmRemoveMemberOpen}
					title="Remove member from team"
					body={`Remove ${memberToRemove?.name || 'this member'} from ${membersTeam?.name || 'this team'}?`}
	    			confirmText="Remove member"
	    			busy={busyId === membersTeam?.id}
	    			onCancel={() => {
	        			if (busyId) return
	        			setConfirmRemoveMemberOpen(false)
	        			setMemberToRemove(null)
	    			}}
	    			onConfirm={confirmRemoveMember}
				/>
			</div>

			<TeamMembersModal
				open={membersModalOpen}
				team={membersTeam}
				allTeams={teams}
				allRegisteredMembers={registeredMembers}
				busy={busyId === membersTeam?.id}
				moveWithDonations={moveWithDonations}
				setMoveWithDonations={setMoveWithDonations}
				targetTeamId={targetTeamId}
				setTargetTeamId={setTargetTeamId}
				selectedAddMemberId={selectedAddMemberId}
				setSelectedAddMemberId={setSelectedAddMemberId}
				onClose={() => {
					if (busyId) return
					setMembersModalOpen(false)
					setMembersTeam(null)
				}}
				onAddMember={addMemberToTeam}
				onRemoveMember={openRemoveMemberConfirm}
				onMoveMember={moveMemberBetweenTeams}
			/>
		</section>
	)
}
