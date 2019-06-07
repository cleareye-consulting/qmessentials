<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTestRunsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('test_runs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->int('item_id');
            $table->foreign('item_id')->references('id')->on('items');
            $table->int('test_plan_id');
            $table->foreign('test_plan_id')->refernces('id')->on('test_plans');
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
        Schema::dropIfExists('test_runs');
    }
}
