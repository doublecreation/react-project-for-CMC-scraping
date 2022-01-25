<?php

$action = isset($_POST['action']) && $_POST['action'] != '' ? trim($_POST['action']) : '';
$request = isset($_POST) && $_POST != '' ? $_POST : array();
$files = isset($_FILES) && $_FILES != '' ? $_FILES : array();
$api_key = '4d6309bd25541bc203a94472a080638a3d3d1b24';

if($action == 'get_currency_live_data'){
	$service_url     = 'https://api.nomics.com/v1/currencies/ticker?key='.$api_key.'&ids=BTC,ETH,XRP,ADA,DOGE&interval=1h&convert=USD&per-page=100&page=1';
	$curl = curl_init($service_url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_POST, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	$curl_response   = curl_exec($curl);
	curl_close($curl);
	$jsonData = json_decode($curl_response,true);
	echo json_encode(array('status'=>true,'data'=>$jsonData));
	exit;
}
else if($action == 'get_currency_listing'){
	$request['perPage'] = isset($request['perPage']) && $request['perPage'] > 0 ? $request['perPage'] : 100;
	$request['pageNo'] = isset($request['pageNo']) && $request['pageNo'] > 0 ? $request['pageNo'] : 1;
	$request['search'] = isset($request['search']) ? $request['search'] : "";
	$service_url     = 'https://api.nomics.com/v1/currencies/ticker?key='.$api_key.'&interval=1h,1d,7d&convert=USD&per-page='.$request['perPage'].'&page='.$request['pageNo'].'';
	$curl = curl_init($service_url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HEADER, 1);
	curl_setopt($curl, CURLOPT_POST, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	$curl_response   = curl_exec($curl);
	curl_close($curl);
	$curl_response = rtrim($curl_response);
	$data = explode("\n",$curl_response);
	$headers = array();
	foreach($data as $part){
	    $middle = explode(":",$part,2);
	    if ( !isset($middle[1]) ) { $middle[1] = null; }
	    $headers[trim($middle[0])] = trim($middle[1]);
	}
	$totalItems = isset($headers['X-Pagination-Total-Items']) ? $headers['X-Pagination-Total-Items'] : 0;
	$jsonData = json_decode($data[11],true);
	
	
	echo json_encode(array('status'=>true,'data'=>$jsonData,'totalItems'=>$totalItems));
	exit;
}
else{
	echo "Invalid";
	exit();
}
?>