import Svg, {Path} from 'react-native-svg';

export const SelectArrow = () => {
  return (
    <Svg width="15" height="8" viewBox="0 0 15 8" fill="none">
      <Path
        d="M1.10718 0.198242L7.60718 6.69824L14.1034 0.202022"
        stroke="#C1C1C1"
        stroke-width="1"
      />
    </Svg>
  );
};

export const SelectCloseArrow = () => {
  return (
    <Svg
      width="15"
      height="8"
      viewBox="0 0 15 8"
      style={{
        transform: [{rotate: '180deg'}],
      }}
      fill="none">
      <Path
        d="M1.10718 0.198242L7.60718 6.69824L14.1034 0.202022"
        stroke="#C1C1C1"
        stroke-width="1"
      />
    </Svg>
  );
};
