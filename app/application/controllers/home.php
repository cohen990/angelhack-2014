<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

session_start(); //we need to call PHP's session object to access it through CI

class Home extends CI_Controller {
	
	private $data = array();
  function __construct()
  {
    parent::__construct();
    if(!$this->session->userdata('logged_in')){
    	redirect('login', 'refresh');
    }
    $session_data = $this->session->userdata('logged_in');
    $this->data['username'] = $session_data['username'];
    
  }

  function index()
  {
    $this->load->view('inc/header');
    $this->load->view('dashboard',$this->data);
    $this->load->view('inc/footer');
  }

  function logout()
  {
    $this->session->unset_userdata('logged_in');
    session_destroy();
    redirect('home', 'refresh');
  }


}

?>