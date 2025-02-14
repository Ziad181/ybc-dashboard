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
  title: 'homePageContent',
  icon: {
    icon: 'tabler-clipboard-text'
  },
  to: 'page-content',
  permissions: [permissions.readHomePage],
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
  title: 'Solar Energy',
  icon: { icon: 'tabler-solar-panel-2' },
  permissions: [permissions.readSolarEnergy],
  children: [
    {
      title: 'Categories Description',
      to: 'solar-energy-categories-description',
    },
    {
      title: 'solutions',
      to: 'solar-energy-solutions',
    },
    {
      title: 'services',
      to: 'solar-energy-services',
    },
    {
      title: 'categories',
      to: 'solar-energy-categories',
    },
    {
      title: 'products',
      to: 'solar-energy-products',
    },
   

  ],
},

{
  title: 'Electricity',
  icon: { icon: 'tabler-plug' },
  permissions: [permissions.readElectricity],
  children: [
    {
      title: 'Categories Description',
      to: 'electricity-categories-description',
    },
    {
      title: 'solutions',
      to: 'electricity-solutions',
    },
    {
      title: 'services',
      to: 'electricity-services',
    },
    {
      title: 'categories',
      to: 'electricity-categories',
    },
    {
      title: 'products',
      to: 'electricity-products',
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
      to: 'news',
    },
    {
      title: 'articles',
      to: 'articles',
    },
    {
      title: 'books',
      to: 'books',
    },

  ],
},
{
  title: 'partnerships',
  icon: {
    icon: 'tabler-hexagons'
  },
  to: 'partnerships',
  permissions: [permissions.readPartnerships],
},
{
  title: 'clients',
  icon: {
    icon: 'tabler-users'
  },
  to: 'clients',
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
