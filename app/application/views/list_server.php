    <div id="wrapper">
	<?php include 'inc/sidebar.inc';?>
        <div id="page-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">List Server</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            <!-- /.row -->
            <div class="row">

                
                <?php
                if(empty($serverList)){
                ?>
                    <div class="label label-info">
                        
                            There isn't any server added. You can set one <a href="<?php echo base_url(); ?>home/add_server">here</a> .
                        
                    </div>
                <?php
                }else{
                    foreach ($serverList as $key => $value) {
                    echo '<div class="serverList">';
                    echo '<h2>'.$value->title.'</h2>';
                    if(!empty($value->image)){
                        echo '<img src="'.$value->image.'">';
                    }else{
                        echo '<img src="'.base_url().'public/img/no_game_banner.jpg">';
                    }
                    echo '<div class="editor"><a href="#" id="'.$value->s_id.'" class="edit" rel="shadowbox"><i class="fa fa-edit"></i></a>   <a href="#" id="'.$value->s_id.'"><i class="glyphicon glyphicon-remove"></i></a></div>';
                        # code...
                    echo '</div>';
                    }
                }
                ?>
            </div>  	
            <!-- /.row -->
        </div>
        <!-- /#page-wrapper -->

    </div>
    <!-- /#wrapper -->
