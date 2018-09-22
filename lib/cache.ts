/**
 * Created by user on 2018/9/22/022.
 */

import { Cacache } from 'lazy-cacache';
import PackageJson =  require('../package.json');

export const cache = new Cacache({
	name: PackageJson.name,
	autoCreateDir: true,
});

export default cache
