import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TypeDropdown extends Component {

	static propTypes = {
		type: PropTypes.array,
		closeDropdown: PropTypes.func,
		dropdownOpen: PropTypes.bool,
		openDropdown: PropTypes.func,
		onSelect: PropTypes.func,
	};

	static contextTypes = {
		t: PropTypes.func,
	};

	render () {
		const { closeDropdown, dropdownOpen, openDropdown, onSelect, selectedType, isBind } = this.props;
		let type = null;
		if (Number(isBind === 1)) {
			type = [{
				id: 0,
				label: 'Send'
			}];
		} else {
			type = this.props.type;
		}
		return (
			<div className="type_drop_down">
				<div onClick={ () => openDropdown() } className="select_text">
					{ this.context.t(selectedType.label) }
				</div>
				<i className={ `fa fa-caret-down fa-lg` }
				   style={ { color: '#dedede', right: '12px', position: 'absolute', top: '18px' } } />
				{ dropdownOpen && (
					<div>
						<div
							className={ `send-v2__from-dropdown__close-area` }
							onClick={ () => closeDropdown() }
						/>
						<div className={ `send-v2__from-dropdown__list dropdown_list` }>
							{
								type.map((type, index) =>
									<div
										className={ `account-list-item__dropdown dropdown_list_item` }
										onClick={ () => {
											onSelect(type);
											closeDropdown();
										} }
										key={ `send-dropdown-type-#${index}` }
									>
										{ this.context.t(type.label) }
									</div>
								)
							}
						</div>
					</div>)
				}
			</div>
		);
	}
}