import 'vuetify/styles';

import { createVuetify } from 'vuetify';

export default async ({
	framework,
	options
}) => {
	framework.use(createVuetify(options ? options.vuetify : null));
};
