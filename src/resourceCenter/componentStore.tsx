import Alert from '../components/Alert/Alert';
import Group from '../components/Group';
import hash from './componentHash';
import { GROUP } from '../constants';

Alert.config = {
  icon: 'https://img.alicdn.com/tfs/TB1i4enT4v1gK0jSZFFXXb0sXXa-32-32.svg',
  text: '弹窗',
};

Alert.initialProps = {
   width: 200,
   height: 100,
   type: 'danger',
   title: 'dangerTitle',
   children: '哈哈'
}

hash.register('alert', Alert);
hash.register(GROUP, Group);// group初始化一个组件

export default hash.getHash();