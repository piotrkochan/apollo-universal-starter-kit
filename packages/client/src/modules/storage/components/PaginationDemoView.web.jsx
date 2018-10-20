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


const PaginationDemoView = ({ storages, test, handlePageChange, pagination, t }) => {
  const renderFunc = text => <span>{text}</span>;
  const columns = [
    {
      title: t('list.column.title'),
      dataIndex: 'name',
      key: 'title',
      displayName: 'MyComponent',
      render: renderFunc
    }
  ];

  console.log(storages);
  test();

  if (!storages) {
    return (<div>loading...</div>)
  }

  return (
    <div>
      <Table dataSource={storages.edges.map(({ node }) => node)} columns={columns} />
      <Pagination
        itemsPerPage={storages.edges.length}
        handlePageChange={handlePageChange}
        hasNextPage={storages.pageInfo.hasNextPage}
        pagination={pagination}
        total={storages.totalCount}
        loadMoreText={t('list.btn.more')}
        defaultPageSize={limit}
      />
    </div>
  );
};

PaginationDemoView.propTypes = {
  items: PropTypes.object,
  handlePageChange: PropTypes.func,
  t: PropTypes.func,
  test: PropTypes.func,
  storages: PropTypes.object,
  pagination: PropTypes.string
};

export default compose(
  graphql(STORAGES_QUERY, {
    options: () => {
      return {
        variables: { limit: limit, after: 0 },
      };
    },
    props: ({ data }) => {
      const { storages } = data;
      
      // console.log(data);

      return {
        storages,
        test: function() {
          console.log('sdfsdf');
        }
      };
    }
  }),
  translate('pagination')
)(PaginationDemoView);

// export default translate('pagination')(PaginationDemoView);
