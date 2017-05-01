import React from 'react';
import { PointModel } from '../Common';

export class DefaultLinkWidget extends React.Component {
  static defaultProps = {
    color: 'black',
    width: 3,
    link:null,
    engine: null,
    smooth: false,
    diagramEngine: null
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  generateLink(extraProps) {
    const { link, width, color } = this.props;
    const { selected } = this.state;
    const bottom = (
      <path
        className={(selected || link.isSelected()) ? 'selected' : ''}
        strokeWidth={width}
        stroke={color}
        {...extraProps}
      />
    );

    const top = (
      <path
        strokeLinecap={'round'}
        data-linkid={link.getID()}
        stroke={color}
        strokeOpacity={selected ? 0.1 : 0}
        strokeWidth={20}
        onContextMenu={event => {
          event.preventDefault();
          this.props.link.remove();
        }}
        {...extraProps}
      />
    );

    return (
      <g key={`link-${extraProps.id}`}>
        {bottom}
        {top}
      </g>
    );
  }

  drawLine() {
    const { link, diagramEngine, pointAdded } = this.props;
    const { points } = link;
    const paths = [];

    // If the points are too close, just draw a straight line
    const margin = (Math.abs(points[0].x - points[1].x) < 50) ? 5 : 50;

    let pointLeft = points[0];
    let pointRight = points[1];

    // Some defensive programming to make sure the smoothing is
    // Always in the right direction
    if (pointLeft.x > pointRight.x) {
      pointLeft = points[1];
      pointRight = points[0];
    }
    console.log( points[0],  points[1]);
    paths.push(this.generateLink({
      id: 0,
      d: ` M${pointLeft.x} ${pointLeft.y} C${pointLeft.x + margin} ${pointLeft.y} ${pointRight.x - margin} ${pointRight.y} ${pointRight.x} ${pointRight.y}` // eslint-disable-line
    }));

    return paths;
  }

  drawAdvancedLine() {
    const { link, smooth, diagramEngine, pointAdded } = this.props;
    const { points } = link;
    const ds = [];

    const paths = ds.map((data, index) => this.generateLink({
      id: index,
      d: data,
      'data-linkid': link.id,
      'data-point': index
    }));

    return paths;
  }

  render() {
    const { points } = this.props.link;
    let paths = [];

    // Draw the line
    if (points.length === 2) {
      paths = this.drawLine();
    } else {
      paths = this.drawAdvancedLine();
    }

    return (
      <g>
        {paths}
      </g>
    );
  }
}
