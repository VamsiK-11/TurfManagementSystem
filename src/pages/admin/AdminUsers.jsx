import { useState, useEffect } from 'react'
import { authAPI } from '../../services/api'
import CustomAlert from '../../components/CustomAlert'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers()
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
      try {
        await authAPI.deleteUser(userId)
        fetchUsers()
        setAlert({ message: 'User deleted successfully', type: 'success' })
      } catch (error) {
        setAlert({ message: 'Failed to delete user', type: 'error' })
      }
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <h1 className="text-3xl font-heading font-bold mb-8 text-gray-800">Users & Owners</h1>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-gray-700">Manage Platform Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-heading font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-heading font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-heading font-semibold text-gray-600">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-heading font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.role === 'OWNER' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Delete User"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  )
}