const getters = {
	name: state => state.user.name,
  sidebar: state => state.app.sidebar,
  addRouters: state => state.permission.addRouters,
  avatar: state => state.user.avatar,
  permission_routers: state => state.permission.routers
}
export default getters