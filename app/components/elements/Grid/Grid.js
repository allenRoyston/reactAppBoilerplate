import React from 'react';
import PropTypes from 'prop-types';

class Grid extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    // get props/prop defaults
    let {columns = 0, rows = 0, blocksize = 0, padding = 0, data = []} = this.props;

    // define screen breakpoints
    let breakpoints = {desktop: 1600, tablet: 1024, mobile: 600}

    // set grid size
    let gridSize = {
      columns,
      rows,      
      blocksize
    }

    // programatically create stylesheet for grid system
    let blockStyles = (() => {
      let randomId = Math.floor(Math.random() * Math.floor(1000));
      let classes = {
        randomId,
        wrapper: `${randomId}_grid-wrapper`,
        container: `__${randomId}_grid-container`,
        box: `__${randomId}_grid-box`,
        inside: `__${randomId}_grid-inside`,
      }

      // Create the <style> tag
      let style = document.createElement('style');      
      
      // WebKit hack :(
      let rtStylesheet = `
        .${classes.wrapper}{
          display: grid;
          width: 100%;
          height: auto
        }

        /* destkop grid */
        .${classes.container} {
          display: grid;
          grid-template-columns: repeat(${gridSize.columns}, ${(100 / gridSize.columns)}%);
          grid-template-rows: repeat(${gridSize.rows}, ${blocksize}px);          
        }  

        /* tablet grid */
        @media only screen and (max-width: ${breakpoints.tablet}px) {
          .${classes.container} {
            display: grid;
            grid-template-columns: 50% 50%;
            grid-template-rows: repeat(auto, ${blocksize}px);             
          }  
        }  

        /* mobile grid */
        @media only screen and (max-width: ${breakpoints.mobile}px) {
          .${classes.container} {
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: repeat(auto,${blocksize}px);            
          }  
        }          

        .${classes.box} {
          padding: ${padding}px;
          font-size: 150%;
        }

        .${classes.inside} {
          width: 100%;
          height: 100%;
          background-color: #444;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;          
        }        
      `

      // add to DOM
      style.appendChild(document.createTextNode(rtStylesheet));      
      document.head.appendChild(style);     
      style.sheet.classes = classes;             
      return style.sheet;
    })();
        
    this.state = {
      blockStyles,
      data,
      breakpoints,
      gridSize
    }
  }

  render() {
    let {data, blockStyles, breakpoints, gridSize} = this.state;

    let setGridSize = (ele, index) => {      
      let styleName = `__${blockStyles.classes.randomId}_block_${index}`;
      let style; 
      
      // for desktop
      style = `
        .${styleName} { 
          grid-column: ${ele.location.column}/ ${(ele.location.column + ele.size)};  
          grid-row: ${ele.location.row}/ ${(ele.location.row + ele.size)}; 
        }
      `
      blockStyles.insertRule(`${style}`, blockStyles.rules.length);
      
      // for tablet
      style = `
        @media only screen and (max-width: ${breakpoints.tablet}px) {
          .${styleName} { 
            grid-column: auto;
            grid-row: auto;
            height: ${gridSize.blocksize}px
          }
        }
      `
      blockStyles.insertRule(`${style}`, blockStyles.rules.length);

      // for mobile
      style = `
      @media only screen and (max-width: ${breakpoints.mobile}px) {
        .${styleName} { 
          grid-column: auto;
          grid-row: auto;
          height: ${gridSize.blocksize}px
        }
      }
      `
      blockStyles.insertRule(`${style}`, blockStyles.rules.length);

      return `${blockStyles.classes.box} ${styleName}`;
    }

    return (
      <div className={blockStyles.classes.wrapper}>
        <div className={blockStyles.classes.container}>
          {
            data.map((item, index) => {
              item.key = `list_id_${index}`;            
              return (
                <div key={item.key} className={setGridSize(item, index)}>
                  <div className={blockStyles.classes.inside}>
                    {index + 1}
                  </div>
                </div>              
              )
            })
          }
        </div> 
      </div>     
    )
  }
}

Grid.propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
  blocksize: PropTypes.number,
  padding: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object)
};

export default Grid;
