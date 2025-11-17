import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({ name: 'mysirar' })
  .useReactNative()
  .connect();

console.tron = Reactotron;

export default Reactotron;
