import React, {Component} from 'react';
import Fuse from 'fuse.js';
import isEmpty from 'lodash/isEmpty';

class AdvanceSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thresholdValue: '0.0',
      inputValue:'',
      isMultipleIdSearch: false,
    };
    this.advanceSearch = this.advanceSearch.bind(this);
    this.onClickRadioButton = this.onClickRadioButton.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.onClickMultipleIdSearchRadioButton = this.onClickMultipleIdSearchRadioButton.bind(this);
  }

  setInputValue(e){
    if(isEmpty(e.target.value)){
      this.props.onFilter(this.props.formattedStudent(this.props.students));
    }
    this.setState({
      inputValue: e.target.value,
    });
  }
  clearFilter(){
    if(!isEmpty(this.state.inputValue)) {
      this.setState({
        inputValue: '',
      });
    }
    this.setState({
      thresholdValue: '0.0',
      isMultipleIdSearch: false,
    });
    this.props.onFilter(this.props.formattedStudent(this.props.students));
  }

  onClickRadioButton(e) {
    this.setState({
      thresholdValue: e.target.value,
      isMultipleIdSearch: false,
    });
  }
  onClickMultipleIdSearchRadioButton(){
    this.setState({
      isMultipleIdSearch: true,
    });
  }
  advanceSearch(e) {
    e.preventDefault();
    if (!this.state.isMultipleIdSearch) {
      const foundKeys = this.props.metaData.headerConfig.map((object) => {
          return object.key;
        }
      );
      const options = {
        shouldSort: true,
        threshold: Number(this.state.thresholdValue),
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: foundKeys,
      };
      if (!isEmpty(this.state.inputValue)) {
        const fuse = new Fuse(this.props.students, options);
        const result = fuse.search(this.state.inputValue);
        this.props.onFilter(this.props.formattedStudent(result));
      }
    }else{
      let searchStudentsIds  = this.state.inputValue.split(',');
      let searchResult = [];
      for(let index in searchStudentsIds){
        let result = this.props.students.filter(obj => {
          return obj.id === Number(searchStudentsIds[index]);
        });
        searchResult.push(...result);
      }
      this.props.onFilter(this.props.formattedStudent(searchResult));
    }
  }
  render(){
    return(
      <form id="advanceSearch" className="advanceSearchForm">
        <div className = "input-radio">
          <label htmlFor = "search_input" className = "input-text">
            <input type="text" onChange={this.setInputValue} value={this.state.inputValue} className = "search-input-advance" />
            <button type="submit" form="advanceSearch" value="Submit" className="search" onClick={this.advanceSearch}>
              <i className="fa fa-search"/>
            </button>
          </label>
          <button type="reset" value="Reset" onClick={this.clearFilter} className = "advance-search-button display-none">
            <i className="fa fa-trash card-icon"/>Clear
          </button>
          <div className = "advance-input-radio">
            <div className="input-radio-container display-none">
              <input type="radio" name="thresholdValue" value="0.0" onClick={this.onClickRadioButton}  defaultChecked />
              <label htmlFor = "normal_search">Normal Search</label>
            </div>
            <div className="input-radio-container">
              <input type="radio" name="thresholdValue" value="0.6" onClick={this.onClickRadioButton} />
              <label htmlFor="deep_search">Deep Search</label>
            </div>
            <div className="input-radio-container">
              <input type="radio" name="thresholdValue" value={this.state.isMultipleIdSearch} onClick={this.onClickMultipleIdSearchRadioButton} />
              <label htmlFor="deep_search">Multiple ID Search</label>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default AdvanceSearch;