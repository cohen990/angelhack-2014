<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

  function __construct()
  {
    parent::__construct();
    $this->load->model('apimodel');
      header('Access-Control-Allow-Origin: *');  
      header('Content-Type: application/json');
  }

  function getRandomBlackCard(){
    //will return random card at each call
    if(!is_null($this->uri->segment(3))){
      $limit= $this->uri->segment(3);
        $res = $this->apimodel->getBlackCardsList($limit);
        if(!empty($res)){
          print json_encode($res);
        }else{
          print json_encode(array( 'error' => 'No results available'));
        }
    }else{

    print 'You have no limit!!!!';
    }
    
  }
  function getRandomWhiteCard(){
//will return random card at each call
    if(!is_null($this->uri->segment(3))){
      $limit= $this->uri->segment(3);
        $res = $this->apimodel->getWhiteCardsList($limit);
        if(!empty($res)){
          print json_encode($res);
        }else{
          print json_encode(array( 'error' => 'No results available'));
        }
    }else{

    print 'You have no limit!!!!';
    }
  }

  function setGameSession(){
      // uid/card_id/session_id/timestamp
    $uid = $this->uri->segment(3);
    $card_id = $this->uri->segment(4);
    $session_id = $this->uri->segment(5);
    $timestamp = $this->uri->segment(6);
    if(!empty($uid) && !empty($card_id) && !empty($session_id) && !empty($timestamp)){
        $data = array(
          'id_sbc' => '',
          'fk_uid' => $uid,
          'fk_blackCards' => $card_id,
          'sid' => $session_id,
          'time' => $timestamp
        );
        $this->apimodel->makeBlackCardSession($data);
      print json_encode(array('success' => 'Game started.'));
    }else{
      print json_encode(array('error' => 'Session not started, missing information.'));
    }
  }

  function getGameSession(){
      // uid/card_id/session_id/timestamp
    $uid = $this->uri->segment(3);
   $res = $this->apimodel->getBlackCardsSession($uid);
    if($res){
      print json_encode($res);
    }else{
      print json_encode(array('error' => 'Session not started, missing information.'));
    }
  }

  function setGameResponse(){
    // uid/card_id/session_id/blackCardAnswer

    $uid = $this->uri->segment(3);
    $card_id = $this->uri->segment(4);
    $session_id = $this->uri->segment(5);
    $black_id = $this->uri->segment(6);

    if(!empty($uid) && !empty($card_id) && !empty($session_id)){
      $data = array(
        'id_swc' => '',
        'fk_uid' => $uid,
        'fk_sid' => $session_id,
        'fk_whiteCards' => $card_id,
        'fk_blackCard' => $black_id
      );
        $this->apimodel->setWhiteCardResponseSession($data);
      print json_encode(array('success' => 'Game answered.'));
    }else{
      print json_encode(array('error' => 'Game not answered, missing information.'));
    }
  }
    function getGameResponse(){
    // blackCardAnswer_id

    $card = $this->uri->segment(3);
    $res = $this->apimodel->getWhiteCardsResponseSession($card);
    if($res){
      print json_encode($res);
    }else{
      print json_encode(array('error' => 'Response not started, missing information.'));
    }
  }
  function getLoginInformation(){
    //$username = $this->input->post("username");
    $username = $this->uri->segment(3);
    if(empty($username)){
      print json_encode(array('error' => 'No username set'));exit;
    }
    //check if user exists in the db (if no)
    //else make user and return uid 
    if(!self::checkUsername($username)){
      print self::checkUsername($username);
    }else{
      self::createUsername($username);
      print self::checkUsername($username);

    }
  }

  function getAllGamesAvailable(){
    $uid = $this->uri->segment(3);
    $res = $this->apimodel->getAllGames($uid);
    if($res){
      print json_encode($res);
    }else{
      print json_encode(array('error' => 'No games available, missing information.'));
    }
  }

  function checkUsername($arg){
    $check = $this->apimodel->getUserDetails($arg);
    if(!is_null($check)){
      return json_encode($check);
    }else{
      return false;
    }
  }
  function createUsername($arg){
    $check = $this->apimodel->setUser($arg);
    if(!$check){
      return false;
    }
    return true;
  }

  //store game cards in a join
  //set game session
  //set card play 

}

?>