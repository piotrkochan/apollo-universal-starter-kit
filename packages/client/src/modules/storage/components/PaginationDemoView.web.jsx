import React from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination } from '../../common/components/web';
import { graphql, compose } from 'react-apollo';
import translate from '../../../i18n';
import STORAGES_QUERY from '../graphql/StoragesQuery.graphql'
import paginationConfig from '../../../../../../config/pagination';
import { PLATFORM } from '../../../../../common/utils';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server' ? paginationConfig.web.itemsNumber : paginationConfig.mobile.itemsNumber;


const PaginationDemoView = ({ items, test, handlePageChange, pagination, t }) => {
  console.info('sdfsdfsdfsdfsdf');
  
  const renderFunc = text => <span>{text}</span>;
  const columns = [
    {
      title: t('list.column.title'),
      dataIndex: 'title',
      key: 'title',
      displayName: 'MyComponent',
      render: renderFunc
    }
  ];

  return (
    <div>
      <Table dataSource={items.edges.map(({ node }) => node)} columns={columns} />
      <Pagination
        itemsPerPage={items.edges.length}
        handlePageChange={handlePageChange}
        hasNextPage={items.pageInfo.hasNextPage}
        pagination={pagination}
        total={items.totalCount}
        loadMoreText={t('list.btn.more')}
        defaultPageSize={items.limit}
      />
    </div>
  );
};

PaginationDemoView.propTypes = {
  items: PropTypes.object,
  handlePageChange: PropTypes.func,
  t: PropTypes.func,
  test: PropTypes.func,
  pagination: PropTypes.string
};

export default compose(
  graphql(STORAGES_QUERY, {
    options: () => {
      return {
        variables: {limit: limit, after: 0}
      }
    },
    props: ({ data }) => {
      console.log(data);
      console.log('AAAAAA');
      console.log('AAAAAA');

      return {
        test: function() {
          console.log('sdfsdf');
        }
      };
    }
  }),
  translate('pagination')
)(PaginationDemoView);

// export default translate('pagination')(PaginationDemoView);
