import React from 'react'
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

const { Header, Sider, Content } = Layout

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = React.useState(false)

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: '/admin/courses',
      icon: <BookOutlined />,
      label: <Link to="/admin/courses">Courses</Link>,
    },
  ]

  const userMenu = {
    items: [
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
        onClick: () => {
          // Navigate to settings page when implemented
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
        theme="dark"
        width={256}
      >
        <div className="p-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center"
          >
            {collapsed ? (
              <div className="text-xl font-bold text-white">A</div>
            ) : (
              <div className="text-xl font-bold text-white">Admin Panel</div>
            )}
          </motion.div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme="dark"
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
              Admin: {user?.name}
            </span>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Avatar
                className="cursor-pointer"
                icon={<UserOutlined />}
                style={{ backgroundColor: '#722ed1' }}
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

export default AdminLayout