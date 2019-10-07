<?php

  $settings_array = array();

  $settings = json_encode($settings_array);

  function render_php($path, $variables=array()) {
    extract($variables, EXTR_SKIP);
    ob_start();
    include($path);
    $template = ob_get_contents();
    ob_end_clean();
    return $template;
  }
