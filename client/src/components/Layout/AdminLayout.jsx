import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Input, Badge } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();

  const isMobile = !screens.md;

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
    {
        key: '/admin/users',
        icon: <UserOutlined />,
        label: <Link to="/admin/users">Users</Link>,
    },
  ];

  const userMenu = {
    items: [
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
        onClick: () => navigate('/admin/settings'), // Placeholder
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
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        theme="light"
        width={256}
        className="shadow-md"
      >
        <div className="flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <div className="text-2xl font-bold text-primary">
              {collapsed ? "A" : "Admin"}
            </div>
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
          <div className="flex items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              <MenuOutlined className="text-xl" />
            </button>
            {!isMobile && (
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search..."
                className="ml-4 w-64"
                variant="filled"
              />
            )}
          </div>

          <div className="flex items-center space-x-6">
            <Badge count={2} size="small">
              <BellOutlined className="text-xl text-gray-600" />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#722ed1' }} />
                {!isMobile && (
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
