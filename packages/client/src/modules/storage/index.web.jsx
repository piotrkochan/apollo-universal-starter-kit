import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';

import { MenuItem } from '../../modules/common/components/web';
import Storage from './containers/PaginationDemo.web';
import resources from './locales';
import Feature from '../connector';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/storage" className="nav-link" activeClassName="active">
    {t('storage:navLink')}
  </NavLink>
));

export default new Feature({
  route: [<Route exact path="/storage" component={Storage} />],
  navItem: (
    <MenuItem key="/storage">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  localization: { ns: 'storage', resources }
});
