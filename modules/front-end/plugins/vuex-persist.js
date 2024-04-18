import VuexPersistence from 'vuex-persist';
 
export default ({ store }) => {
	new VuexPersistence({
		module: ['faculty', 'post']
	}).plugin(store);
};
