<?php
Class ApiModel extends CI_Model
{
	
    function getBlackCardsList($limit){
    	
    	$query = $this->db->query("SELECT * FROM blackCards ORDER BY RAND() LIMIT $limit ");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
    }
    function getWhiteCardsList($limit){
    	
    	$query = $this->db->query("SELECT * FROM whiteCards ORDER BY RAND() LIMIT $limit ");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
    }

    function getUserDetails($usr){
    	$query = $this->db->query("SELECT * FROM users WHERE username= '$usr' LIMIT 1 ");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row->id;
			}
    	return $res;
    }
    function setUser($usr){
    	$data = array(
		   'id' => '' ,
		   'firstname' => '' ,
		   'lastname' => '' ,
		   'email' => '' ,
		   'username' => $usr ,
		   'password' => '' ,
		   'created_at' => '' ,
		   'updated_at' => '' ,
		   'rank' => '' 
		);

		$this->db->insert('users', $data); 
		return true;
	}
	function makeBlackCardSession($arg){
		$this->db->insert('sessionBlackCards',$arg);
		return true;
	}
	function getBlackCardsSession($uid){
    	
    	$query = $this->db->query("SELECT sBlackCards.id_sbc, sBlackCards.sid, BlackCards.text FROM sessionBlackCards as sBlackCards, blackCards as BlackCards
	WHERE sBlackCards.fk_uid = $uid 
		AND sBlackCards.fk_blackCards = BlackCards.id_bc  
ORDER BY id_sbc DESC");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
    }
    function setWhiteCardResponseSession($arg){
		$this->db->insert('sessionWhiteCards',$arg);
		return true;
	}
	function getWhiteCardsResponseSession($arg){
    	
    	$query = $this->db->query("SELECT * FROM 
		sessionWhiteCards as sWhiteCards, 
		whiteCards as WhiteCards
	WHERE sWhiteCards.fk_whiteCards = WhiteCards.id_wc
		AND sWhiteCards.fk_sid = $arg
ORDER BY id_wc DESC");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
    }
    function getAllGames($uid){
    	date_default_timezone_set("Europe/London");
		$time = strtotime("-1 minute");

    	$query = $this->db->query("SELECT * FROM angalhack.sessionBlackCards as sbc, blackCards as bc  
	WHERE sbc.fk_uid != $uid 
		AND sbc.fk_blackCards = bc.id_bc
		AND sbc.time > $time
ORDER BY id_sbc DESC");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
    }
    function getGameSessionBlackCard($arg){

    $query = $this->db->query("SELECT * FROM sessionBlackCards as sBlackCards, blackCards as BlackCards
	WHERE sBlackCards.sid = '$arg'
		AND sBlackCards.fk_blackCards = BlackCards.id_bc  
ORDER BY id_sbc DESC ");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
	}
	function setWinner($arg){
		$this->db->insert('gameWinner',$arg);
		return true;
	}
	function getWinner($arg){
		$query = $this->db->query("SELECT * FROM gameWinner WHERE fk_uid = '$arg' ");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
	}
}
?>		