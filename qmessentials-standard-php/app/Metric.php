<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Metric extends Model
{
    use SoftDeletes;
    public $metric_name = '';
    public $has_multiple_results = false;
}
