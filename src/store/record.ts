export const initialState = {
  componentMap: {}, // {uuid: {type:'componentType', containerProps, componentProps}}
  canvasWidth: 1200,
  canvasHeight: 750,
  scale: 100,
  selectComponentId: "",
  containIds: [],
  areaPos: {
    startPos: {
      left: 0,
      top: 0,
    },
    endPos: {
      left: 0,
      top: 0,
    },
  },
};

class Record {
  public list: any[];
  public maxLength: number;
  public curIndex: number;
  constructor(list, index, maxLength?) {
    this.list = list;
    this.curIndex = index;
    this.maxLength = maxLength || 20;
  }
  
  addRecord(record) {
    this.list.push(record);
    if(this.list.length > this.maxLength) {
      this.list.shift();
    }
    // console.log(this.list.length,'length');
    this.curIndex = this.list.length - 1;
  }
  getPrevRecord() {
    this.curIndex = this.curIndex > 0 ? this.curIndex - 1 : this.curIndex;
    console.log(  this.curIndex, this.list)
    return this.list[this.curIndex];
  } 

  getNextRecord() {
    if(this.curIndex + 1 >= this.list.length -1) {
      this.curIndex = this.list.length -1
    } else {
      this.curIndex += 1;
    }

    return this.list[this.curIndex];
  }

}

export default new Record([initialState], 0);

