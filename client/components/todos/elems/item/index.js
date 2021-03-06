import Component, { PropTypes } from 'lib/component';
import Checkbox from 'client/components/checkbox';
import Input from 'client/components/input';
import Model from './model';
import styles from './styles.css';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class TodosItem extends Component {
  constructor(props) {
    super(props);

    /**
     * @type {Object}
     */
    this.state = {
      input: '',
      isEditing: false
    };
  }

  /**
   * @protected
   * @param {SyntheticEvent} e
   */
  _handleCheckboxChange(e) {
    this.model.toggle(e.target.checked);
  }

  /**
   * @protected
   */
  _handleDeleteButtonClick() {
    this.model.remove();
  }

  /**
   * @protected
   */
  _handleLabelDoubleClick() {
    this.model.startEditing();
  }

  /**
   * @protected
   * @param {SyntheticEvent} e
   */
  _handleInputBlur() {
    this.model.saveChanges();
  }

  /**
   * @protected
   * @param {SyntheticEvent} e
   */
  _handleInputChange(e) {
    this.model.syncInputText(e.target.value);
  }

  /**
   * @protected
   * @param {SyntheticEvent} e
   */
  _handleInputKeyDown(e) {
    let key = e.which;

    if (key === ESCAPE_KEY) {
      this.model.cancelEditing();
    } else if (key === ENTER_KEY) {
      this.model.saveChanges();
    }
  }

  /**
   * @override
   */
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isEditing && this.state.isEditing) {
      this.refs.input.focus();
    }
  }

  /**
   * @override
   */
  render() {
    let props = this.props;
    let isCompleted = props.isCompleted;
    let stls = this.styles;
    let itemStyles;

    if (!props.isVisible) {
      itemStyles = stls.itemIsHidden;
    } else if (this.state.isEditing) {
      itemStyles = stls.itemIsEditing;
    } else if (isCompleted) {
      itemStyles = stls.itemIsCompleted;
    } else {
      itemStyles = stls.item;
    }

    return (
      <li className={itemStyles}>
        <div className={stls.view}>
          <Checkbox
            className={stls.checkbox}
            isChecked={isCompleted}
            onChange={this._handleCheckboxChange.bind(this)}
          />
          <label
            className={stls.label}
            onDoubleClick={this._handleLabelDoubleClick.bind(this)}>
            {this.props.text}
          </label>
          <button
            className={stls.deleteButton}
            onClick={this._handleDeleteButtonClick.bind(this)}>
          </button>
        </div>
        <div className={stls.edit}>
          <Input
            ref="input"
            value={this.state.input}
            className={stls.input}
            onBlur={this._handleInputBlur.bind(this)}
            onChange={this._handleInputChange.bind(this)}
            onKeyDown={this._handleInputKeyDown.bind(this)}
          />
        </div>
      </li>
    );
  }
}

TodosItem.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  isCompleted: PropTypes.bool
};

TodosItem.defaultProps = {
  isVisible: true,
  isCompleted: false
};

TodosItem.styles = styles;
TodosItem.Model = Model;
