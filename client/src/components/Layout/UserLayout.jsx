import React from 'react'
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  DashboardOutlined,
  BookOutlined,
  TrophyOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

const { Header, Sider, Content } = Layout

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = React.useState(false)

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: <Link to="/courses">Courses</Link>,
    },
    {
      key: '/certificates',
      icon: <TrophyOutlined />,
      label: <Link to="/certificates">Certificates</Link>,
    },
  ]

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
        onClick: () => {
          // Navigate to profile page when implemented
        },
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: logout,
      },
    ],
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={256}
      >
        <div className="p-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center"
          >
            {collapsed ? (
              <div className="text-xl font-bold text-primary">L</div>
            ) : (
              <div className="text-xl font-bold text-primary">LMS</div>
            )}
          </motion.div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center"
          />

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-gray-600">
              Welcome back, {user?.name}!
            </span>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Avatar
                className="cursor-pointer"
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default UserLayout