import styled from 'styled-components';
import { DARK_BLUE, BLUE_GREY, WHITE, LIGHT_GREY } from '../../shared/colors';

export const ControlsDeleteContainer = styled.div`
  display: flex;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 94.5vh;
`;

export const ScrollingContainer = styled.div`
  flex: 1 1 100%;
  background-color: ${WHITE};
  overflow: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 0 10px;
  background-color: ${LIGHT_GREY};
`;

export const Title = styled.h2`
  margin: 0.5rem 1.25rem 0.5rem;
  font-weight: 800;
  font-style: bold;
  font-size: 2rem;
  color: ${DARK_BLUE};
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 16px 0 0 10px;
`;

const styles = () => ({
  paper: {
    margin: '0 auto',
    paddingLeft: 100,
    width: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    borderBottom: `1px solid ${BLUE_GREY}`,
    borderTop: `1px solid ${BLUE_GREY}`,
  },
  button: {
    margin: '.5rem 1rem .5rem 0',
    width: '10rem',
    height: '2.5rem',
  },
});

export const TextEditorBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-right: 10px;
`;

export default styles;