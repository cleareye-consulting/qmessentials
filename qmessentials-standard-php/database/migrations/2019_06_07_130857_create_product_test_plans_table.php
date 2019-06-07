<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductTestPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_test_plans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->int('product_id');
            $table->foreign('product_id')->references('id')->on('prduct');
            $table->int('test_plan_sequence_number');
            $table->int('test_plan_id');
            $table->foreign('test_plan_id')->references('id')->on('test_plan');
            $table->boolean('is_required');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_test_plans');
    }
}
