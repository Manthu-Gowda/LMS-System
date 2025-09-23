import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Input, Badge, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Header, Sider, Content } = Layout;

const Logo = ({ collapsed }) => (
  <div className="flex items-center justify-center text-white h-16 bg-transparent">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
    {!collapsed && <span className="ml-3 text-xl font-semibold">ADMIN</span>}
  </div>
);

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();

  const isMobile = !screens.lg;

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
    { key: '/admin/courses', icon: <BookOutlined />, label: <Link to="/admin/courses">Courses</Link> },
    { key: '/admin/users', icon: <UserOutlined />, label: <Link to="/admin/users">Users</Link> },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Settings',
          onClick: () => navigate('/admin/settings'),
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
      ]}
    />
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl"
        width={250}
      >
        <Logo collapsed={collapsed} />
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} className="bg-transparent border-r-0"/>
      </Sider>
      <Layout className="bg-gray-50">
        <Header className="bg-white px-4 flex items-center justify-between shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-xl"
          />
          <div className="flex items-center space-x-5">
            <Badge count={1} size="small">
              <BellOutlined className="text-xl" />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                {!isMobile && <span className="ml-2 font-medium">{user?.name}</span>}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
