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
    	
    	$query = $this->db->query("SELECT * FROM blackCards ORDER BY RAND() LIMIT $limit ");
    	
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
    	
    	$query = $this->db->query("SELECT WhiteCards.text as Response, WhiteCards.id_wc as ResponseID FROM 
		sessionWhiteCards as sWhiteCards, 
		blackCards as BlackCards,
		whiteCards as WhiteCards
	WHERE sWhiteCards.fk_whiteCards = WhiteCards.id_wc
		AND BlackCards.id_bc = $arg
ORDER BY id_bc DESC");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
    }
    function getAllGames($uid){
    	$query = $this->db->query("SELECT * FROM angalhack.sessionBlackCards WHERE fk_uid != $uid ORDER BY id_sbc DESC");
    	
    	$res= array();
    	foreach ($query->result() as $row)
			{
			    $res[]= $row;
			}
    	return $res;
    }
}
?>		