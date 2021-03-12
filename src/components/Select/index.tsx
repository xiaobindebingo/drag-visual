import { TreeNode } from './treeNode';
import React, { useState } from 'react';
import ClassNames from 'classnames';
import './index.scss';
interface ISelectProps{
    value?:string|string[],
    treeData?:any[],
    onChange?: (value:any)=>any;
    defaultValue?: string|string[],
    disabled?: boolean,
    treeCheckable?: boolean,
    placeholder?: React.ReactNode,
}
export const TreeSelect: React.FunctionComponent<ISelectProps> = (props) => {
    const  { placeholder, value, treeCheckable, treeData, onChange, disabled} = props;
    const [getValue, setValue] = useState<string|string[]|undefined>(value);
    const [isExpand, setExpand] = useState<boolean>(false);
  
    const renderDataItem = (item: {title:string, value:string, children?: any[]})=>{
        return(<TreeNode title={item.title} value={item.value}>
            {item.children?.map(renderDataItem)}
        </TreeNode>)
    }
    const renderChildren = () => {
        return treeData?.map(renderDataItem)
    }
    const expandcls = ClassNames({
        expand: isExpand,
        hide: !isExpand,
        dropDownSelect: true,
    })

    const handleExpandClick = () => {
       setExpand(!isExpand);
    }
    const handleTreeNodeClick = () => {
      if(onChange){
        onChange(value)
      }
    }
    return <div>
        <div className="select" onClick={handleExpandClick}>
            <span className="placeholder">
                {getValue ? getValue : placeholder}
            </span>
        <div className={expandcls}>
          {renderChildren()}
        </div>
      
        </div>
    </div>;
}

export const mockTreeData = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-0',
          key: '0-0-0',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
      children: [
        {
          title: 'Child Node3',
          value: '0-1-0',
          key: '0-1-0',
        },
        {
          title: 'Child Node4',
          value: '0-1-1',
          key: '0-1-1',
        },
        {
          title: 'Child Node5',
          value: '0-1-2',
          key: '0-1-2',
        },
      ],
    },
  ];

  export class Test extends React.Component{
    state={
      count: 1,
    }

    handleClick(){
      const { count } = this.state
      // this.setState({
      //   count: this.state.count+1
      // })
      // this.setState({
      //   count: this.state.count+1
      // })
      new Promise((resolve,reject)=>{
          resolve(1)
      }).then(()=>{
        this.setState((state:{count:number})=>({count:state.count+1}))
        console.log(this.state.count) 
        this.setState((state:{count:number})=>({count:state.count+1}))
        console.log(this.state.count) 
      })
      // this.setState((state:{count:number})=>({count:state.count+1}))
      // console.log(count) // 1
      // this.setState((state:{count:number})=>({count:state.count+1}))
      // console.log(count) //1 

    }
    
    render(){
      return(
        <div onClick={this.handleClick.bind(this)}>
          {this.state.count}
        </div>
      )
    }
  }