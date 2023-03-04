
import VueCookieComply from 'vue-cookie-comply';
// import 'vue-cookie-comply/dist/style.css';

export default class CookieComply {
	// eslint-disable-next-line
	async execute(framework) {
		framework.use(VueCookieComply);
	}
}
