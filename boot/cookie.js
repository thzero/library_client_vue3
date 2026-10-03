
import VueCookieComply from 'vue-cookie-comply';
// import 'vue-cookie-comply/dist/style.css';

export default class CookieComply {
	async execute(framework) {
		framework.use(VueCookieComply);
	}
}
