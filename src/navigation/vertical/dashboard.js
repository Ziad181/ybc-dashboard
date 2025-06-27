import { permissions } from "@/helpers/permissions.enum";

export default [{
  title: 'home',
  icon: {
    icon: 'tabler-smart-home'
  },
  to: 'dashboard',
  permissions: [],

},
{
  title: 'banners',
  icon: {
    icon: 'tabler-photo'
  },
  to: 'banners',
  permissions: [permissions.readHomePage],
},
{
  title: 'activities',
  icon: {
    icon: 'tabler-activity'
  },
  to: 'activities',
  permissions: [permissions.readHomePage],
},
{
  title: 'programs_and_services',
  icon: {
    icon: 'tabler-clipboard-list'
  },
  to: 'programs-and-services',
  permissions: [permissions.readHomePage],
},
{
  title: 'about_us',
  icon: { icon: 'tabler-clipboard-text' },
  permissions: [permissions.readHomePage],
  children: [
    {
      title: 'home',
      to: 'about-us-home',
    },
    {
      title: 'business_support_center',
      to: 'about-us-business-support-center',
    },
    {
      title: 'yemen_business_center',
      to: 'about-us-yemen-business-center',
    },
  ],
},
{
  title: 'Blog',
  icon: { icon: 'tabler-article' },
  permissions: [permissions.readBlog],
  children: [
    {
      title: 'news',
      to: 'blog-news',
    },
    {
      title: 'articles',
      to: 'blog-articles',
    },
    {
      title: 'The Releases',
      to: 'blog-releases',
    },

  ],
},
{
  title: 'Management',
  icon: { icon: 'tabler-subtask' },
  permissions: [permissions.readBlog],
  children: [
    {
      title: 'General Assembly',
      to: 'management-general-assembly',
    },
    {
      title: 'Board of Directors',
      to: 'management-board-of-directors',
    },
    {
      title: 'Executive Management',
      to: 'management-executive-management',
    },
    {
      title: 'Board Committees',
      to: 'management-board-committees',
    },
    {
      title: 'the consultants',
      to: 'management-advisory-teams',
    },
  ],
},
{
  title: 'Members',
  icon: { icon: 'tabler-users' },
  permissions: [permissions.readBlog],
  children: [
    {
      title: 'Club members',
      to: 'members-club-members',
    },
    {
      title: 'Business Support Center members',
      to: 'members-business-support',
    },
  ],
},
{
  title: 'organizational-structure',
  icon: {
    icon: 'tabler-hierarchy'
  },
  to: 'organizational-structure',
  permissions: [permissions.readClients],
},
{
  title: 'partners',
  icon: {
    icon: 'tabler-users'
  },
  to: 'partners',
  permissions: [permissions.readClients],
},
{
  title: 'messages',
  icon: {
    icon: 'tabler-mail'
  },
  to: 'messages',
  permissions: [permissions.readMessages],
},

{
  title: 'settings',
  icon: {
    icon: 'tabler-settings'
  },
  to: 'settings',
  permissions: [permissions.readSettings],
},
]
