<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateObservationResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('observation_results', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('observation_id')->unsigned();
            $table->foreign('observation_id')->references('id')->on('observations');
            $table->double('result_value')->nullable();
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
        Schema::dropIfExists('observation_results');
    }
}
