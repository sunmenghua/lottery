import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onAddUsers = this.onAddUsers.bind(this);
    this.getRandomUser = this.getRandomUser.bind(this);
    this.showUser = this.showUser.bind(this);
    this.state = {
      total: 50,
      users: [],
      wonUserIds: [],
      winUserId: -1,
      running: false,
      showUserId: -1,
    };
  }
  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }
  render() {
    return (
      <div className="container app">
        <h2 className="text-center mt-3 d-none">2 0 1 8 年 电 通 数 码 年 会</h2>
        <div className="row mt-3 mx-auto">
          {this.state.users.length > 0 &&
            <div className="card h-100 w-100">
              <div className="card-body p-0 text-left users">
                {this.state.users.map(user => (
                  <div className={"d-inline-block user " + (this.state.winUserId === user.id ? 'active' : '')} onClick={() => this.showUser(user.id)} key={user.id}>
                    <img className="w-100 h-100" src={user.image} alt={user.id} />
                  </div>
                ))}
              </div>
            </div>
          }
          {this.state.users.length < 1 &&
            <div className="alert alert-warning w-100">
              <h3>使用说明</h3>
              <p>1. 点击选择用户按钮后选择所有参与抽奖用户的头像。（注意用户头像文件不要过大）</p>
              <p>2. 点击开始抽奖按钮后开始抽奖。</p>
              <p>3. 点击停止按钮即抽出中奖者。</p>
            </div>
          }
        </div>
        <div className="row mt-3 mx-auto">
          <div className="w-100 text-center">
            {this.state.users.length < 1 &&
              <div>
                <button type="button" className="btn btn-secondary mx-3" onClick={() => this.input.click()}>选择用户</button>
                <input type="file" className="d-none" ref={ele => this.input = ele} accept="image/*" multiple="multiple" onChange={this.onAddUsers} />
              </div>
            }
            {this.state.users.length > 0 && this.state.running === false &&
              <button type="button" className="btn btn-info mx-3" onClick={this.onStart}>开始抽奖</button>
            }
            {this.state.users.length > 0 && this.state.running === true &&
              <button type="button" className="btn btn-danger mx-3" onClick={this.onStop}>停止抽奖</button>
            }
            <button ref={ele => this.refModal = ele} type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#exampleModalCenter" />
          </div>
        </div>
        <div className="row mt-3 mx-auto">
          <div className="card w-100">
            <div className="card-header">中奖</div>
            <div className="card-body p-0 text-left users">
              {this.state.wonUserIds.map((userId, index) => (
                <div className="d-inline-block position-relative" onClick={() => this.showUser(userId)} key={userId}>
                  <img src={this.state.users[userId].image} alt={userId} width="100" height="100" />
                  <div className="won-user-index">{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal fade mx-auto" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-dialog w-100 h-100 d-flex" role="document">
            <div className="modal-content my-auto">
              <div className="modal-body p-0">
                {this.state.showUserId > -1 &&
                  <img src={this.state.users[this.state.showUserId].image} alt='恭喜获奖' />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  showUser(showUserId) {
    this.setState({showUserId});
    this.refModal.click();
  }
  onStart() {
    if (this.state.users.length < 1) {
      alert('请添加需要抽奖的用户图片！');
      return;
    } else if (this.state.users.length <= this.state.wonUserIds.length) {
      alert('所有用户都已获奖，请刷新页面重新开始抽奖！');
      return;
    }

    this.setState({running: true});
    this.timerID = setInterval(this.getRandomUser, 200);
  }
  onStop() {
    clearInterval(this.timerID);
    const { winUserId, wonUserIds } = this.state;
    wonUserIds.push(winUserId);
    this.setState({wonUserIds, running: false});

    setTimeout(() => this.showUser(winUserId), 400);
  }
  onAddUsers(e) {
    this.setState({users: []});
    let files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let reader = new FileReader();
      reader.onload = re => {
        let users = this.state.users;
        users[i] = {id: i, image: re.target.result};
        this.setState({users});
      };
      reader.readAsDataURL(file);
    }
  }
  getRandomUser() {
    let users = this.state.users;
    let wonUserIds = this.state.wonUserIds; 

    let willWinUserIds = users.map(user => user.id).filter(userId => !wonUserIds.includes(userId));
    let winIndex = parseInt(Math.random() * willWinUserIds.length, 10);
    let winUserId = willWinUserIds[winIndex];

    this.setState({winUserId});
  }
}

export default App;
