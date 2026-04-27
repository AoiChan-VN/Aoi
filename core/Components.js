export class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render(); // Re-render khi state thay đổi
  }
  render() {
    return ""; 
  }
}

export const createComponent = (container, componentInstance) => {
  container.innerHTML = componentInstance.render();
};
 
