
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="login-panel panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Please Sign In</h3>
                    </div>
                    <div class="panel-body">
                    <?php echo validation_errors(); ?>
   					<?php echo form_open('verifylogin',array('role'=>'form')); ?>
                            <fieldset>
                                <div class="form-group">
      									<input type="text" size="20" placeholder="Username" class="form-control" id="username" name="username"/>                                    
                                </div>
                                <div class="form-group">                                    
      								<input class="form-control" placeholder="Password" type="password" size="20" id="passowrd" name="password"/>
                                </div>
                                <!-- Change this to a button or input when using this as a form -->
                                 <input type="submit" value="Login" class="btn btn-lg btn-success btn-block"/>
                                 <div class="form-group">                                    
      								<small><a href="#">Register</a></small>
                                </div>
                            </fieldset>
                       <?php echo form_close(); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    