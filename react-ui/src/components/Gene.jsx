import React from 'react'
import  TreeView  from './TreeView';
import { SimplePane } from './Panes'

const Gene = () => {
  return (
    <div>
      <SimplePane>
        <div>
          <TreeView />
        </div>
      </SimplePane>
    </div>
  )
}

export default Gene