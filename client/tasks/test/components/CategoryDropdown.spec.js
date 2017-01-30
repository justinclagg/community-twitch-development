import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import * as testData from '../testData';
import { CategoryDropdown } from '../../components/CategoryDropdown.jsx';

describe('CategoryDropdown', function () {

    let wrapper, props;

    function shallowRender() {
        const { categories, category, router } = testData;
        props = {
            categories,
            category,
            router
        };
        wrapper = shallow(<CategoryDropdown {...props} />);
    }

    beforeEach(function () {
        shallowRender();
    });

    it('should render DropDownMenu with props', function () {
        const DropDownMenu = wrapper.find('DropDownMenu');
        const childProps = DropDownMenu.props();

        expect(DropDownMenu).to.have.length(1);
        expect(DropDownMenu.children()).to.deep.equal(
            wrapper.find('MenuItem')
        );
        expect(childProps.value).to.equal(props.category);
        expect(childProps.onChange).to.deep.equal(
            wrapper.instance().onMenuItemClick
        );
    });

    it('should render a MenuItem for each category with props', function () {
        const MenuItems = wrapper.find('MenuItem');
        const menuItem = MenuItems.first();
        const childProps = menuItem.props();

        expect(MenuItems).to.have.length(props.categories.length);
        expect(childProps.value).to.equal(props.category);
        expect(childProps.primaryText).to.equal(props.category);
    });

    it('DropDownMenu change event should trigger onMenuItemClick()', sinon.test(function () {
        const onMenuItemClick = this.spy(CategoryDropdown.prototype, 'onMenuItemClick');
        shallowRender();
        const DropDownMenu = wrapper.find('DropDownMenu');

        DropDownMenu.simulate('change');

        expect(onMenuItemClick).to.be.calledOnce;
    }));

    it('onMenuItemClick() should push a category endpoint to the router', sinon.test(function () {
        const { router, category } = props;
        const routerSpy = this.spy(router, 'push');

        wrapper.instance().onMenuItemClick('event', 'index', category);

        expect(routerSpy).to.be.calledOnce.calledWithExactly(
            `/contribute/${encodeURIComponent(category)}`
        );
    }));

});