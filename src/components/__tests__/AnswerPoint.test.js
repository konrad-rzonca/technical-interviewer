import React from 'react';
import {render} from '@testing-library/react';
import AnswerPoint from '../AnswerPoint';

const defaultProps = {
  point: {
    title: 'Point title',
    description: 'Point description',
  },
  isSelected: false,
  isSmallScreen: false,
  learningMode: false,
  answerStyles: {
    color: '#333333',
    hoverBg: '#ffffff',
  },
  categoryIndex: 0,
  pointIndex: 0,
  onPointClick: jest.fn(),
  tooltipProps: {},
};

describe('AnswerPoint', () => {
  test('can rerender from valid to invalid point data without hook errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(
        () => {},
    );

    const {container, rerender} = render(<AnswerPoint {...defaultProps}/>);

    expect(container.textContent).toContain('Point title');

    rerender(<AnswerPoint {...defaultProps} point={null}/>);

    expect(container.textContent).toBe('');
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Rendered fewer hooks than expected'),
    );

    consoleErrorSpy.mockRestore();
  });
});
