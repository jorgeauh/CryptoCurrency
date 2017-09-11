<?php

if(isset($_REQUEST['type'])){
	if($_REQUEST['type'] == 'histominute'){
		$currencies = array(
			'BTC' => array('USD', 'EUR'),
			'ETH' => array('USD', 'EUR')
		);

		$dataPrices = array();
		foreach ($currencies as $fsym => $tsyms) {
			foreach ($tsyms as $value) {
				$url = 'https://min-api.cryptocompare.com/data/histominute?fsym='.$fsym.'&tsym='.$value.'&limit=10';
				$result = file_get_contents($url);
				$r = json_decode($result, true);
				foreach ($r['Data'] as $key => $data) {
					$date = date('Y-m-d H:i:s', $data['time']);
					$dataPrices[$fsym][$date][$value] = array('number' => $data['open']);
				}
			}
		}
		$dataPrices = json_encode($dataPrices);
		echo $dataPrices;
	}
	elseif ($_REQUEST['type'] == 'price') {
		$url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR';
		$result = file_get_contents($url);
		echo $result;
	}
	elseif ($_REQUEST['type'] == 'graphic') {
		$currencies = array(
			'BTC' => array('USD', 'EUR'),
			'ETH' => array('USD', 'EUR')
		);

		$dataPrices = array();
		foreach ($currencies as $fsym => $tsyms) {
			foreach ($tsyms as $value) {
				$url = 'https://min-api.cryptocompare.com/data/histominute?fsym='.$fsym.'&tsym='.$value.'&limit=10';
				$result = file_get_contents($url);
				$r = json_decode($result, true);
				foreach ($r['Data'] as $key => $data) {
					$date = date('Y-m-d H:i:s', $data['time']);
					//time, btc-usd, btc-eur, eth-usd, eth-eur
					$dataPrices[$date][$fsym][$value] = array('number' => $data['open']);


					// $dataPrices[$fsym][$value][] = 
					// $dataPrices[$fsym][$date][$value] = array('number' => $data['open']);
				}
			}
		}
		$dataPrices = json_encode($dataPrices);
		echo $dataPrices;
	}
}











