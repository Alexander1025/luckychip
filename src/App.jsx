import React from 'react';
import './App.css';

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 分数
      score:0,
      // 分数等级
      scoreLv:[20,50,150,600,2000,6000,12000],
      // 当前等级
      lv:1,
      // 行
      row:8,
      // 列
      column:8,
      // 棋盘数据
      boardData:[
        // 棋盘行内数据
        // [
        //   {
        //     text:null,
        //     lock:false,
        //   },
        // ],
      ],
      // 道具
      arms:[
        {name:"copy",count:2,index:0},
        {name:"delete",count:2,index:1},
        {name:"upgrade",count:2,index:2},
        // {name:"move",count:2,index:3},
      ],
      nowarms:-1,
      // 是用道具tips
      tips:'',
      nextChip:[],
      sameArr:[],
      thisTierArr:[],
      nextTierArr:[],
      changeRow:0,
      changeColumn:0,
    };

    this.initBoardData();
    this.randomPutdown();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeRow = this.handleChangeRow.bind(this);
    this.handleChangeColumn = this.handleChangeColumn.bind(this);
    this.reset = this.reset.bind(this);
    this.searchAround = this.searchAround.bind(this);
    this.resetDataFalse = this.resetDataFalse.bind(this);
    this.calcThisTier = this.calcThisTier.bind(this);
    this.addChip = this.addChip.bind(this);
    this.calcScore = this.calcScore.bind(this);
    this.randomAdd = this.randomAdd.bind(this);
    this.putdown = this.putdown.bind(this);
    this.usearms = this.usearms.bind(this);
    this.copy = this.copy.bind(this);
    this.delete = this.delete.bind(this);
    this.move = this.move.bind(this);
    this.upgrade = this.upgrade.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  }
  
  reset() {
    console.log("这里是重开");
    this.setState({
      boardData: []
    });
    this.setState({
      nextChip: []
    });
    this.setState({
      score: 0
    });
    this.state.boardData = [];
    this.state.nextChip = [];
    this.initBoardData();
    this.randomPutdown();
  }

  putdown(item, item1, index, index1){
    if (this.state.nowarms >= 0){
      console.log("使用道具啦");
      console.log(this.state.nowarms);
      console.log(this.state.arms[this.state.nowarms]);
      // arms:[
      //   {name:"copy",count:2,index:0},
      //   {name:"delete",count:2,index:1},
      //   {name:"move",count:2,index:2},
      //   {name:"upgrade",count:2,index:3},
      // ],
      switch(this.state.arms[this.state.nowarms].name) {
        case 'copy':
          this.copy(item, item1, index, index1);
          break;
        case 'delete':
          this.delete(item, item1, index, index1);
          break;
        case 'move':
          this.move(item, item1, index, index1);
          break
        case 'upgrade':
          this.upgrade(item, item1, index, index1);
          break
        default:
          
      } 
      return false;
    }
    if (!item1.text){
      console.log("放下");
      this.state.boardData[index][index1].text = this.state.nextChip[0];
      this.randomAdd();
      this.setState({
        boardData: [...this.state.boardData]
      });
      this.calcScore(this.state.nextChip[0], 1);
      this.state.nextChip.shift();
      this.state.nextChip.push(parseInt(Math.random()*(parseInt(this.state.lv)+1))+1);
    } else {
      console.log("计算");
      this.setState({
        thischangeRow: index
      });
      this.setState({
        changeColumn: index1
      });
      this.state.sameArr = [];
      this.searchAround(index, index1, item1.text, true);
      this.resetDataFalse();
      
    }
  }

  randomAdd(){
    console.log(this.state.row);
    let thisChangeRow = parseInt(Math.random()*this.state.row);
    let thisChangeColumn = parseInt(Math.random()*this.state.column);
    console.log(thisChangeRow, thisChangeColumn);
    console.log(this.state.boardData[thisChangeRow][thisChangeColumn]);
    while (!this.state.boardData[thisChangeRow][thisChangeColumn].text){
      this.state.boardData[thisChangeRow][thisChangeColumn].text = parseInt(Math.random()*(parseInt(this.state.lv)+1))+1;
    }
  }

  calcScore(score, multiple){
    // console.log(score, multiple);
    // console.log(this.state.score);
    // console.log(multiple*Math.pow(2,score));
    let thisScore = this.state.score;
    thisScore += multiple*Math.pow(2,score);
    let nowLv = this.state.lv;
    let nowLv1 = this.state.lv;
    for (let i = 0 ; i <= this.state.scoreLv.length-1 ; i++){
      if (thisScore >= this.state.scoreLv[i]){
        this.setState({
          lv: parseInt(i)+2
        });
        nowLv1 = parseInt(i)+2;
      }
    }
    if (nowLv != nowLv1){
      for (let p = 0 ; p <= this.state.arms.length-1 ; p++){
        this.state.arms[p].count = this.state.arms[p].count+1;
      }
    }
    this.setState({
      score: thisScore
    });
    // console.log(thisScore);
  }

  searchAround(row, col, item1, next){
    // console.log(row, col, item1);
    this.state.boardData[row][col].lock = true;
    let Up = {
      row: row-1,
      col: col
    };
    let Down = {
      row: row+1,
      col: col
    };
    let Left = {
      row: row,
      col: col-1
    };
    let Right = {
      row: row,
      col: col+1
    };
    // console.log(Up);
    // console.log(Down);
    // console.log(Left);
    // console.log(Right);
    // sameArr:[],
    // thisTierArr:[],
    // nextTierArr:[],
    

    if (Up.row>=0){
      // console.log("上可用");
      // console.log(this.state.boardData[Up.row][Up.col]);
      if (!this.state.boardData[Up.row][Up.col].lock){
        if (this.state.boardData[Up.row][Up.col].text == item1){
          this.state.boardData[Up.row][Up.col].lock = true;
          this.state.sameArr.push({
            row: Up.row,
            col: Up.col
          });
          this.state.nextTierArr.push({
            row: Up.row,
            col: Up.col
          });
          // console.log(this.state.sameArr);
        }
      }
    }
    if (Down.row<this.state.row){
      // console.log("下可用");
      if (!this.state.boardData[Down.row][Down.col].lock){
        if (this.state.boardData[Down.row][Down.col].text == item1){
          this.state.boardData[Down.row][Down.col].lock = true;
          this.state.sameArr.push({
            row: Down.row,
            col: Down.col
          });
          this.state.nextTierArr.push({
            row: Down.row,
            col: Down.col
          });
          // console.log(this.state.sameArr);
        }
      }
    }
    if (Left.col>=0){
      // console.log("左可用");
      if (!this.state.boardData[Left.row][Left.col].lock){
        if (this.state.boardData[Left.row][Left.col].text == item1){
          this.state.boardData[Left.row][Left.col].lock = true;
          this.state.sameArr.push({
            row: Left.row,
            col: Left.col
          });
          this.state.nextTierArr.push({
            row: Left.row,
            col: Left.col
          });
          // console.log(this.state.sameArr);
        }
      }
    }
    if (Right.col<this.state.column){
      // console.log("右可用");
      if (!this.state.boardData[Right.row][Right.col].lock){
        if (this.state.boardData[Right.row][Right.col].text == item1){
          this.state.boardData[Right.row][Right.col].lock = true;
          this.state.sameArr.push({
            row: Right.row,
            col: Right.col
          });
          this.state.nextTierArr.push({
            row: Right.row,
            col: Right.col
          });
          // console.log(this.state.sameArr);
        }
      }
    }

    // console.log(this.state.nextTierArr);
    // debugger
    if (next){
      if (this.state.nextTierArr.length >= 1){
        // 这里还有下一层
        this.state.thisTierArr = this.state.nextTierArr;
        // console.log(this.state.thisTierArr);
        this.state.nextTierArr = [];
        // console.log(this.state.nextTierArr);
        let that = this;
        setTimeout(function (){
          that.calcThisTier();
        },0)
      } else {
        // 没有下一层啦
        console.log("输出");
        // console.log(this.state.sameArr, item1);
        this.calcScore(parseInt(item1), this.state.sameArr.length);
        this.addChip(this.state.sameArr, item1);
        this.resetDataFalse();
        
      }
      
    }
    
    
  }

  calcThisTier(){
    let that = this;
    for (let n = 0 ; n <= this.state.thisTierArr.length-1 ; n++){
      
      setTimeout(function (){
        // console.log(that.state.thisTierArr);
        // if (){

        // }
        let thisRow = that.state.thisTierArr[n].row;
        let thisCol = that.state.thisTierArr[n].col;
        // console.log(thisRow, thisCol);
        // debugger
        if (n == that.state.thisTierArr.length-1){
          console.log("下一层");
          that.state.thisTierArr = [];
          that.searchAround(thisRow, thisCol, that.state.boardData[thisRow][thisCol].text, true);
        } else {
          that.searchAround(thisRow, thisCol, that.state.boardData[thisRow][thisCol].text, false);
        }
      },0);
      
    }
  }

  copy(item, item1, index, index1){
    this.state.nextChip[0] = item1.text;
    this.setState({
      tips: ""
    });
    this.setState({
      nowarms: -1
    });
  }

  delete(item, item1, index, index1){
    console.log(item, item1, index, index1);
    item1.text = null;
    this.setState({
      tips: ""
    });
    this.setState({
      nowarms: -1
    });
  }

  move(item, item1, index, index1){
    console.log(item, item1, index, index1);
    item1.text = parseInt(item1.text)+1;
    this.setState({
      tips: ""
    });
    this.setState({
      nowarms: -1
    });
  }

  upgrade(item, item1, index, index1){
    console.log(item, item1, index, index1);
    item1.text = parseInt(item1.text)+1;
    this.setState({
      tips: ""
    });
    this.setState({
      nowarms: -1
    });
  }

  usearms(arms){
    console.log(this);
    console.log(arms);
    if (arms.count > 0){
      arms.count = arms.count-1;
      this.setState({
        nowarms: arms.index
      });
      this.setState({
        tips: "正在使用"+arms.name+"道具"
      });
    }
  }

  addChip(sameArr, item1){
    // console.log(this.state.thischangeRow);
    // console.log(this.state.changeColumn);
    if (sameArr.length >= 3){
      let that = this;
      for (let i = 0 ; i <= sameArr.length-1 ; i++){
        // console.log(this.state.boardData[sameArr[i].row][sameArr[i].col]);
        setTimeout(function (){
          that.state.boardData[sameArr[i].row][sameArr[i].col].text = null;
        },0)
      }
      // console.log(that.state.thischangeRow,that.state.changeColumn);
      setTimeout(function (){
        // console.log("设置");
        that.state.boardData[that.state.thischangeRow][that.state.changeColumn].text = parseInt(item1)+1;
        that.setState({
          boardData: [...that.state.boardData]
        });
      },0);
    } else {
      console.log("3个以上才能消");
    }
    
    // this.state.boardData[index][index1].text = this.state.nextChip[0];
    
  }

  resetDataFalse(){
    // console.log(this);
    
    for (let i = 0 ; i <= this.state.boardData.length-1 ; i++){
      for (let p = 0 ; p<= this.state.boardData[i].length-1 ; p++){
        this.state.boardData[i][p].lock = false;
      }
    }
  }

  randomPutdown(){
    for (let i = 0 ; i < this.state.column ; i++){
      this.state.nextChip.push(parseInt(Math.random()*(parseInt(this.state.lv)+1))+1);
    }
    console.log(this.state.nextChip);
    this.setState({
      nextChip: [...this.state.nextChip]
    })
  }

  initBoardData(){
    for (let i = 0 ; i < this.state.row ; i++){
      let newArr = [];
      for (let p = 0 ; p < this.state.column ; p++){
        let newCol = {};
        newCol.text = null;
        newCol.lock = false;
        newArr.push(newCol);
      }
      this.state.boardData.push(newArr);
    }
    this.setState({
      boardData: [...this.state.boardData]
    })
  }

  handleChangeRow(e){
    console.log(e);
    this.setState({row: e.target.value});
  }
  handleChangeColumn(e){
    this.setState({column: e.target.value});
  }

  render() {
    return (
      <div className="App-main">
        <div className="App-head">
          <div>
            分数:{this.state.score}
            
            <img src={'./../public/icon/1.png' || './../public/icon/9.png'} alt=""/>
            
          </div>
          <div>
            当前等级：{this.state.lv}
          </div>
          <div onClick={this.reset}>
            重开
          </div>
        </div>
        <div className="App-head">
          <div>
            行：
            <input type="text" value={this.state.row} onChange={this.handleChangeRow} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            列：
            <input type="text" value={this.state.column} onChange={this.handleChangeColumn} />
          </div>
        </div>
        <br/>
        <div className="App-board">
          {this.state.boardData.map((item, index)=>
            <div key={index} className="App-row">
              {item.map((item1, index1)=>
              <div key={index+'-'+index1} onClick={()=>{this.putdown(item, item1, index, index1)}}>
                <span>{item1.text}</span>
                <img src={item1.text ? require('./../public/icon/'+item1.text+'.png') : ''} alt="" />
              </div>
              )}
            </div>
          )}
          <br/><br/>
          <div className="App-row App-row1">
            {this.state.nextChip.map((item, index)=>
              <div key={index}>
                {item}
              </div>
            )}
          </div>
          <br/>
          <div className="App-tips">
            &nbsp;{this.state.tips}
          </div>
          <div className="App-arms">
            {this.state.arms.map((item, index)=>
              <div onClick={() =>{this.usearms(item)}} key={index} className="App-armslist" style={{ backgroundImage: 'url('+require('./../public/icon/'+item.name+'.png')+')' }}>
                {item.count}
              </div>
            )}
          </div>
          
          {/* <div className="App-row">
            <div>
              1
            </div>
            <div>
              2
            </div>
            <div>
              3
            </div>
          </div> */}
        </div>
      </div>
    );
  }
};

export default NameForm;
