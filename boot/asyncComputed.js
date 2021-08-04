import * as Vue from 'vue';
import * as AsyncComputed from 'vue3-async-computed';

export default async ({
	framework
}) => {
    const asyncComputed = AsyncComputed.createPlugin({ ref: Vue.ref });
	framework.use(asyncComputed);
};
