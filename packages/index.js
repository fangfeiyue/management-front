import BaseTable from './BaseTabel/index';
import QueryForm from './QueryForm/index';

export default {
	install(app) {
		app.use(QueryForm);
		app.use(BaseTable);
	}
};
