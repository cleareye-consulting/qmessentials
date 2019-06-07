<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lot extends Model
{
    public $lot_number = '';
    public $product_id = 0;
    public $customer_name = '';
}
