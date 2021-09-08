import React from '../core/react'
import ReactDom from '../core/react-dom'

function Home () {
  return <h1>Home Component</h1>
}

class App extends React.Component {
  constructor(props) {
    super()
    this.state = {
      count: 0
    }
  }

  render() {
    const add = () => {
      this.setState({
        count: this.state.count + 1
      })
    }
    return (
      <div>
        <Home />
        <div>{this.state.count}</div>
        <button onClick={add}>+1</button>
      </div>
    )
  }
}

ReactDom.render(
  <App />,
  document.getElementById("app")
)