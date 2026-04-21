import { ProtectedRoute } from '../../auth/components/protected-route'
import AccountLayout from '../layout/account-layout'

const AccountPage = () => {
  return (
    <ProtectedRoute>
      <AccountLayout />
    </ProtectedRoute>
  )
}

export default AccountPage