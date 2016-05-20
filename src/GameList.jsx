/*eslint "no-unused-vars": "off"*/
/*global Gun*/
import React from 'react';
import Game from './Game.jsx';
import gun from './gun.jsx';
import { Link } from 'react-router';

require('./styles/GameList.scss');

const games = gun.get('games');

export default class GameList extends React.Component {
	constructor() {
		super();
		this.state = {
			gameList: []
		};
	}

	render() {
		const list = this.state.gameList;
		let games;
		if (!list.length) {
			games = <p className='no-games'>
				No games here. <Link to='/new-game'>Start one?</Link>
			</p>;
		} else {
			games = <ul>
				{list}
			</ul>;
		}
		return <div className='responsive-size gamelist'>
			<div className='container'>
				<h1>Active Games</h1>
				{games}
			</div>
		</div>;
	}

	componentDidMount() {
		const list = this;
		this.setState(() => {
			return {
				unmounted: false
			};
		});
		games.map().val((game, field) => {
			if (this.unmounted || game === null) {
				return;
			}
			const age = Gun.is.node.state(game, 'key');
			const now = new Date().getTime();
			const hourAgo = now - 1000 * 60 * 60;
			if (age < hourAgo) {
				// reset the game
				games.path(field).put(null);
				return gun.game(game.key).reset();
			}
			list.setState(state => {
				const games = state.gameList;
				return {
					gameList: games.concat(<Game key={game.key} game={game} />)
				};
			});
		});
	}

	componentWillUnmount() {
		this.unmounted = true;
	}
}
